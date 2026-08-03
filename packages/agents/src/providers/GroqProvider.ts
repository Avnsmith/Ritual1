import axios from 'axios';
import { AIProvider, LLMOptions } from './AIProvider.js';

export class GroqProvider implements AIProvider {
  readonly name = 'Groq';

  constructor(
    private apiKey: string,
    private model: string = 'llama-3.1-8b-instant'
  ) {}

  async chat(options: LLMOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Groq API key missing. Please configure key in Settings modal.');
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: this.model,
        messages: options.messages,
        temperature: options.temperature ?? 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      }
    );

    return response.data?.choices?.[0]?.message?.content?.trim() || '';
  }
}

export class OpenRouterProvider implements AIProvider {
  readonly name = 'OpenRouter';

  constructor(
    private apiKey: string,
    private model: string = 'anthropic/claude-3.5-sonnet'
  ) {}

  async chat(options: LLMOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key missing. Please configure key in Settings modal.');
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: this.model,
        messages: options.messages,
        temperature: options.temperature ?? 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://ritual1-app.vercel.app',
          'X-Title': 'WowWeb AI Agent',
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      }
    );

    return response.data?.choices?.[0]?.message?.content?.trim() || '';
  }
}

export class OllamaProvider implements AIProvider {
  readonly name = 'Ollama';

  constructor(
    private baseUrl: string = 'http://localhost:11434',
    private model: string = 'llama3'
  ) {}

  async chat(options: LLMOptions): Promise<string> {
    const response = await axios.post(
      `${this.baseUrl}/api/chat`,
      {
        model: this.model,
        messages: options.messages,
        stream: false,
      },
      { timeout: 30000 }
    );

    return response.data?.message?.content?.trim() || '';
  }
}
