import google.generativeai as genai
from main.config_sba import GOOGLE_API_KEY, config, SAFETY_SETTINGS
from jinja2 import Environment, FileSystemLoader
from fastapi import HTTPException
import markdown
import logging
import asyncio
from main.models_sba import Assessment

# Initialize Jinja2 environment
env = Environment(loader=FileSystemLoader('./templates'))


def gen_model():
    """
    Initializes and configures the GenerativeModel from GenAI.

    Returns:
        genai.GenerativeModel: The configured GenerativeModel instance.
    """
    # Configure GenAI with the provided Google API key
    genai.configure(api_key=GOOGLE_API_KEY)

    # Initialize a GenerativeModel with specified model name, generation configuration, and safety settings
    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro-latest",
        generation_config=config,
        safety_settings=SAFETY_SETTINGS
    )

    return model


async def generate_exercise(data: Assessment):
    """
    Generates an exercise based on the provided assessment data.

    Args:
        data (Assessment): The assessment data used to generate the exercise.

    Returns:
        str: The generated exercise in markdown format.

    Raises:
        HTTPException: If there is an error during the generation process.
    """
    try:
        prompts = generate_exercise_input(data)
        responses = []
        
            # Process each prompt in the list
        for prompt in prompts:
                # Generate content using the GenAI model in a separate thread
                response = await asyncio.to_thread(gen_model().generate_content, prompt)
                generated_exercise = response.parts[0].text
                responses.append(generated_exercise)

        # Combine all responses and convert to markdown
        resp = "".join(responses)
        res = markdown.markdown(resp)

        return res
    except Exception as e:
        logging.error(f"Error generating exercise: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating exercise: {e}")


def generate_exercise_input(data: Assessment):
    """
    Generates a list of exercise prompts based on the provided assessment data.

    Args:
        data (Assessment): The assessment data used to generate the prompts.

    Returns:
        list: A list containing the generated prompt.

    Raises:
        ValueError: If any of the required fields are missing or invalid.
    """
    role = data.role
    levels = data.levels
    tools = data.tools
    hints = data.hints

    # Validate required fields
    if not role or not levels:
        raise ValueError("Role and levels fields are required")

    for level_info in levels:
        level = level_info.level
        noOfQuestions = level_info.noOfQuestions
        keywords = level_info.keywords

        # Validate each level's fields
        if not level or not noOfQuestions or not keywords:
            raise ValueError("Each level must have level, noOfQuestions, and keywords fields")

        level_lower = level.lower()
        if level_lower not in ['low', 'medium', 'high']:
            raise ValueError("Level must be 'Low', 'Medium' or 'High'")

        if not (1 <= int(noOfQuestions) <= 20):
            raise ValueError("Number of questions should be between 1 and 20")

    # Render the exercise prompt using a Jinja2 template
    template = env.get_template('exercise_prompt_template.jinja')
    prompt = template.render(role=role, levels=levels, tools=tools, hints=hints)

    return [prompt]
