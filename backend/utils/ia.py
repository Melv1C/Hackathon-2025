from openai import OpenAI
import os
from dotenv import load_dotenv

def createClient():
    load_dotenv()
    api = os.getenv("AI_API_KEY")
    return OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api,
        )

def make_prompt(client, content):
    with open("prompt.txt", "r") as f:
        prompt = f.read()
        response = client.chat.completions.create(
            extra_body={},
            model= "google/gemini-2.0-flash-thinking-exp:free",
            messages=[
                {
                "role": "user",
                "content": [
                    {
                    "type": "text",
                    "text": prompt
                    }
                    # {
                    # "type": "image_url",
                    # "image_url": {
                    #     "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
                    # }
                    # }
                ]
                }
            ]
        )
    return response.choices[0].message.content
