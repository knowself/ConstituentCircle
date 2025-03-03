
import OpenAI from 'openai';

let openAIInstance: OpenAI | null = null;

export const initOpenAIClient = () => {
  try {
    if (!openAIInstance) {
      const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        console.warn('OpenAI API key is missing. Some features may not work properly.');
        return null;
      }
      openAIInstance = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });
    }
    return openAIInstance;
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
    return null;
  }
};

export const getOpenAIClient = () => {
  if (!openAIInstance) {
    console.warn('OpenAI client not initialized. Attempting to initialize now.');
    initOpenAIClient();
    if (!openAIInstance) {
      console.error('Failed to initialize OpenAI client on demand.');
      return null;
    }
  }
  return openAIInstance;
};
