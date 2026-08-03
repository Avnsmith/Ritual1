import axios from 'axios';
import { AIProvider, LLMOptions } from './AIProvider.js';

export class OpenAIProvider implements AIProvider {
  readonly name = 'OpenAI';

  constructor(
    private apiKey: string,
    private model: string = 'gpt-4o-mini',
    private baseUrl: string = 'https://api.openai.com/v1'
  ) {}

  async chat(options: LLMOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key missing. Please configure key in Settings modal.');
    }

    const payload: any = {
      model: this.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.3,
    };

    if (options.maxTokens) payload.max_tokens = options.maxTokens;
    if (options.jsonOutput) payload.response_format = { type: 'json_object' };

    const response = await axios.post(`${this.baseUrl}/chat/completions`, payload, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    });

    return response.data?.choices?.[0]?.message?.content?.trim() || '';
  }
}
