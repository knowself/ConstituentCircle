
import { Configuration, OpenAIApi } from 'openai';

let openAIInstance: OpenAIApi | null = null;

export const initOpenAIClient = () => {
  if (!openAIInstance) {
    const configuration = new Configuration({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
    openAIInstance = new OpenAIApi(configuration);
  }
  return openAIInstance;
};

export const getOpenAIClient = () => {
  if (!openAIInstance) {
    throw new Error('OpenAI client not initialized');
  }
  return openAIInstance;
};
