
import OpenAI from 'openai';

let openAIInstance: OpenAI | null = null;

export const initOpenAIClient = () => {
  if (!openAIInstance) {
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is missing. Please set OPENAI_API_KEY environment variable.');
    }
    openAIInstance = new OpenAI({
      apiKey,
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
