import axios from 'axios';
import { AIProvider, LLMOptions } from './AIProvider.js';

export class AnthropicProvider implements AIProvider {
  readonly name = 'Anthropic';

  constructor(
    private apiKey: string,
    private model: string = 'claude-3-5-sonnet-20241022'
  ) {}

  async chat(options: LLMOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Anthropic API key missing. Please configure key in Settings modal.');
    }

    const systemMsg = options.messages.find(m => m.role === 'system')?.content;
    const userMsgs = options.messages
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));

    const payload: any = {
      model: this.model,
      messages: userMsgs,
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature ?? 0.3,
    };

    if (systemMsg) payload.system = systemMsg;

    const response = await axios.post('https://api.anthropic.com/v1/messages', payload, {
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    });

    return response.data?.content?.[0]?.text?.trim() || '';
  }
}
