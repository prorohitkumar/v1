from pydantic import BaseModel


class BlogInput(BaseModel):
    input_text: str
    no_words: str
    blog_style: str
    keywords: str
