export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMOptions {
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  jsonOutput?: boolean;
}

export interface AIProviderConfig {
  provider: 'openai' | 'gemini' | 'anthropic' | 'groq' | 'openrouter' | 'ollama' | 'ritual';
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  baseUrl?: string;
}

export interface AIProvider {
  readonly name: string;
  chat(options: LLMOptions): Promise<string>;
}
