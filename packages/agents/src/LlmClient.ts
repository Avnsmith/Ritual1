import axios from 'axios';

export interface LlmCompletionOptions {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
}

export class LlmClient {
  private geminiKey: string | undefined;
  private openAiKey: string | undefined;
  private groqKey: string | undefined;

  constructor() {
    this.geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    this.openAiKey = process.env.OPENAI_API_KEY;
    this.groqKey = process.env.GROQ_API_KEY;
  }

  hasApiKeys(): boolean {
    return Boolean(this.geminiKey || this.openAiKey || this.groqKey);
  }

  async generateText(options: LlmCompletionOptions): Promise<string> {
    const { prompt, systemPrompt = 'You are WowWeb, an expert autonomous AI web research and verification agent on RitualNet.' } = options;

    // 1. Try Gemini API
    if (this.geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`;
        const response = await axios.post(
          url,
          {
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nTask: ${prompt}` }],
              },
            ],
            generationConfig: {
              temperature: options.temperature ?? 0.3,
            },
          },
          { timeout: 15000 }
        );

        const candidates = response.data?.candidates;
        if (candidates && candidates[0]?.content?.parts[0]?.text) {
          return candidates[0].content.parts[0].text.trim();
        }
      } catch {
        // Fallback to next provider
      }
    }

    // 2. Try OpenAI API
    if (this.openAiKey) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
            temperature: options.temperature ?? 0.3,
          },
          {
            headers: {
              Authorization: `Bearer ${this.openAiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 15000,
          }
        );

        const content = response.data?.choices[0]?.message?.content;
        if (content) return content.trim();
      } catch {
        // Fallback to next provider
      }
    }

    // 3. Try Groq API
    if (this.groqKey) {
      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
            temperature: options.temperature ?? 0.3,
          },
          {
            headers: {
              Authorization: `Bearer ${this.groqKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 15000,
          }
        );

        const content = response.data?.choices[0]?.message?.content;
        if (content) return content.trim();
      } catch {
        // Fallback to next provider
      }
    }

    return '';
  }
}
