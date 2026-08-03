import axios from 'axios';
import { AIProvider, LLMOptions } from './AIProvider.js';

export class GeminiProvider implements AIProvider {
  readonly name = 'Gemini';

  constructor(
    private apiKey: string,
    private model: string = 'gemini-1.5-flash'
  ) {}

  async chat(options: LLMOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key missing. Please configure key in Settings modal.');
    }

    const systemMsg = options.messages.find(m => m.role === 'system')?.content || '';
    const userMsgs = options.messages.filter(m => m.role !== 'system').map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const fullText = systemMsg ? `${systemMsg}\n\n${userMsgs}` : userMsgs;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const response = await axios.post(
      url,
      {
        contents: [{ role: 'user', parts: [{ text: fullText }] }],
        generationConfig: {
          temperature: options.temperature ?? 0.3,
        },
      },
      { timeout: 20000 }
    );

    const candidate = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidate?.trim() || '';
  }
}
