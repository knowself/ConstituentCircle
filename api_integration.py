import os
import openai
import requests

# Load API keys from environment variables
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
GOOGLE_AI_API_KEY = os.getenv('GOOGLE_AI_API_KEY')

# Function to handle API interaction

def get_ai_suggestions(user_input):
    # Set up OpenAI API client
    openai.api_key = OPENAI_API_KEY

    try:
        # Updated OpenAI API call
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=[{'role': 'user', 'content': user_input}],
            max_tokens=150  # Specify max tokens for response
        )
        openai_suggestion = response['choices'][0]['message']['content']
    except Exception as e:
        print(f'OpenAI API error: {e}')
        openai_suggestion = None

    # If OpenAI fails, fallback to Google AI
    if not openai_suggestion:
        try:
            google_response = requests.post(
                'https://us-language.googleapis.com',  # Updated with the correct endpoint for US processing
                headers={'Authorization': f'Bearer {GOOGLE_AI_API_KEY}'},
                json={'input': user_input}
            )
            google_response.raise_for_status()
            google_suggestion = google_response.json().get('suggestion')
        except Exception as e:
            print(f'Google AI API error: {e}')
            google_suggestion = None
        return google_suggestion

    return openai_suggestion
