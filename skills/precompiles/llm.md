# LLM

> **Category**: Precompile Features  
> **Contract / Address**: `0x0802`  
> **Description**: On-chain AI inference: chat, tool calling, structured output, streaming

---

### What it teaches

The LLM precompile. 30-field ABI input. OpenAI-compatible chat completions with tool/function calling and structured output (JSON mode).

Short-running async: result in same TX

### Key patterns

*   SSE streaming via EIP-712 signed events
*   Temperature and topP scaled ×1000 (0.7 = 700)
*   Private LLM via ECIES encryption to executor
*   Model selection via TEEServiceRegistry capability query
