
import OpenAI from 'openai';

let openAIInstance: OpenAI | null = null;

export const initOpenAIClient = () => {
  if (!openAIInstance) {
    openAIInstance = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }
  return openAIInstance;
};

export const getOpenAIClient = () => {
  if (!openAIInstance) {
    throw new Error('OpenAI client not initialized');
  }
  return openAIInstance;
};
