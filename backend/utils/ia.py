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
    with open("utils/prompt.txt", "r") as f:
        prompt = f.read()
    prompt = prompt.format(content=content)
    response = client.chat.completions.create(
        extra_body={},
        #model="google/gemini-2.5-pro-exp-03-25:free",
        model="google/gemini-2.0-flash-exp:free",
        messages=[
            {
            "role": "user",
            "content": [
                {
                "type": "text",
                "text": prompt
                }
            ]
            }
        ]
    )
    return response.choices[0].message.content
