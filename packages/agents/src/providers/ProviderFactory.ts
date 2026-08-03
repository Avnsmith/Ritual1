import { AIProvider, AIProviderConfig } from './AIProvider.js';
import { OpenAIProvider } from './OpenAIProvider.js';
import { GeminiProvider } from './GeminiProvider.js';
import { AnthropicProvider } from './AnthropicProvider.js';
import { GroqProvider, OpenRouterProvider, OllamaProvider } from './GroqProvider.js';

export class ProviderFactory {
  static createProvider(config?: AIProviderConfig): AIProvider {
    const providerType = config?.provider || 'openai';
    const apiKey = config?.apiKey || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || '';

    switch (providerType) {
      case 'gemini':
        return new GeminiProvider(
          config?.apiKey || process.env.GEMINI_API_KEY || apiKey,
          config?.model || 'gemini-1.5-flash'
        );
      case 'anthropic':
        return new AnthropicProvider(
          config?.apiKey || process.env.ANTHROPIC_API_KEY || apiKey,
          config?.model || 'claude-3-5-sonnet-20241022'
        );
      case 'groq':
        return new GroqProvider(
          config?.apiKey || process.env.GROQ_API_KEY || apiKey,
          config?.model || 'llama-3.1-8b-instant'
        );
      case 'openrouter':
        return new OpenRouterProvider(
          config?.apiKey || process.env.OPENROUTER_API_KEY || apiKey,
          config?.model || 'anthropic/claude-3.5-sonnet'
        );
      case 'ollama':
        return new OllamaProvider(
          config?.baseUrl || 'http://localhost:11434',
          config?.model || 'llama3'
        );
      case 'openai':
      default:
        return new OpenAIProvider(
          config?.apiKey || process.env.OPENAI_API_KEY || apiKey,
          config?.model || 'gpt-4o-mini'
        );
    }
  }
}
