import os
import json
from groq import Groq
from anthropic import Anthropic

groq_client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

claude_client = Anthropic(
    api_key = os.environ.get("CLAUDE_API_KEY")
)

def generateLLMResopnse(prompt):
    try:
        message = claude_client.messages.create(
            max_tokens=4096,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="claude-opus-4-7",
        )
        # print("LLM Response: ",message.content[0].text)
        return format_ouput(message.content[0].text)
    except Exception as error:
        raise Exception(f"LLM error {error}")


def generateGroqResponse(prompt):
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="openai/gpt-oss-20b",
        )
        generated_content = chat_completion.choices[0].message.content
        # print("Generated Content:", generated_content)
        return format_ouput(generated_content)
    except Exception as error:
        return error
    

def format_ouput(data):
    try:
        data = data.strip()

        if data.startswith("```json"):
            data = data[7:]  
        if data.endswith("```"):
            data = data[:-3] 

        # Try parsing JSON
        return json.loads(data)

    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON string: {e}")