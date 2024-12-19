import os
from api_integration import get_ai_suggestions

# Set environment variables for testing
os.environ['OPENAI_API_KEY'] = 'test_openai_key'
os.environ['GOOGLE_AI_API_KEY'] = 'test_google_ai_key'

# Test function to validate AI suggestions

def test_get_ai_suggestions():
    test_input = "How can I improve my email communication?"
    print("Testing with input:", test_input)
    suggestion = get_ai_suggestions(test_input)
    print("Suggestion received:", suggestion)

if __name__ == '__main__':
    test_get_ai_suggestions()
