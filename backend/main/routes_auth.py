from fastapi import Request, Depends, HTTPException, status, APIRouter
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.security import OAuth2AuthorizationCodeBearer
from requests_oauthlib import OAuth2Session
import os
import logging

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl="https://gitlab.stackroute.in/oauth/authorize",
    tokenUrl="https://gitlab.stackroute.in/oauth/token",
)


# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

authRouter = APIRouter()

# GitLab OAuth settings
# Deployment
client_id = "7d22dc76b7f3fd37ef73fca83f6e084f5d8515e013c6c67d20661cbbcc96eff4"
client_secret = "84aa929f87d217b86ff03ac4bf60404fa08f8888895cc811dae1806c2cf1e790"
redirect_uri = "https://content-crafter-dev.stackroute.in/crafter/api/v2/auth/callback"

# Local
# client_id = "c5b34466ce6d9934e55db3d864434de2f9af9cd27d8397b5c399090400fbbb10"
# client_secret = "c1769cc31f2b16b496c07e3cea5097a3fd72948c7e9ddb1252fac81bb0985516"
# redirect_uri = (
#     "http://localhost:8000/crafter/api/v2/auth/callback"  # Change to HTTPS Locally
# )

authorization_base_url = "https://gitlab.stackroute.in/oauth/authorize"
token_url = "https://gitlab.stackroute.in/oauth/token"

# Disable SSL verification to allow self-signed certificate
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"


@authRouter.get("/login")
async def index():
    gitlab = OAuth2Session(client_id, redirect_uri=redirect_uri)
    # Generate the authorization URL with prompt='login' to force showing the login page
    # You can also add max_age to force re-authentication if the previous login was within a specific time
    authorization_url, state = gitlab.authorization_url(
        authorization_base_url,
        prompt="login",
        max_age=0,  # Forces immediate re-authentication regardless of when the user last logged in
    )
    response = RedirectResponse(url=authorization_url)
    response.set_cookie(key="oauth_state", value=state, httponly=True)
    return response


@authRouter.get("/callback")
async def callback(request: Request):
    try:
        state = request.cookies.get("oauth_state")
        gitlab = OAuth2Session(client_id, state=state, redirect_uri=redirect_uri)
        token = gitlab.fetch_token(
            token_url,
            client_secret=client_secret,
            authorization_response=str(request.url),
        )
        user_info_response = gitlab.get("https://gitlab.stackroute.in/api/v4/user")
        user_info = user_info_response.json()

        # Fetch groups the user is part of
        groups_response = gitlab.get(
            "https://gitlab.stackroute.in/api/v4/groups/21298/subgroups"
        )
        groups = groups_response.json()

        # Extract group IDs
        # group_ids = [group['id'] for group in groups]

        # Encode group IDs as a JSON string
        # group_ids_json = json.dumps(group_ids)

        group_ids_json = [
            21301,
            21309,
            21303,
            21308,
            21306,
            21299,
            21312,
            21307,
            21302,
            21310,
            21304,
            21311,
            21305,
        ]

        print(f"Groups:{group_ids_json}")

        data_to_send = {
            "name": user_info["username"],
            "token": str(token["access_token"]),
            "groups": group_ids_json,  # Store as JSON string
        }
        # redirect_url = "http://localhost:3000/callback"
        redirect_url = "https://content-crafter-dev.stackroute.in/callback"

        response = RedirectResponse(url=redirect_url)
        for key, value in data_to_send.items():
            response.set_cookie(
                key, value, httponly=False
            )  # Ensure cookie is accessible via JS

        return response
    except Exception as e:
        print(f"Error during callback: {e}")
        return JSONResponse(
            content={"error": "Internal Server Error"},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# Endpoint to check if user is authenticated
@authRouter.get("/api/is_authenticated")
async def is_authenticated(token: str = Depends(oauth2_scheme)):
    if token:
        return JSONResponse(content={"authenticated": True})
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )


def configure_routes_auth(app):
    """
    Configures routes for the FastAPI application by adding the defined router to the app instance.

    Parameters:
    app (FastAPI): The FastAPI application instance where the router is to be added.
    """
    app.include_router(
        authRouter, prefix="/crafter/api/v2/auth", tags=["Authentication"]
    )
