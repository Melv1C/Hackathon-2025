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

def make_prompt(client):
    return client.chat.completions.create(
        extra_body={},
        model="google/gemini-2.5-pro-exp-03-25:free",
        messages=[
            {
            "role": "user",
            "content": [
                {
                "type": "text",
                "text": "What is in this image?"
                },
                {
                "type": "image_url",
                "image_url": {
                    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
                }
                }
            ]
            }
        ]
        )
if __name__ == "__main__":
    client = createClient()
    response = make_prompt(client)
    print(response)