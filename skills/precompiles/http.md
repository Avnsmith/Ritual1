# HTTP

> **Category**: Precompile Features  
> **Contract / Address**: `0x0801`  
> **Description**: External HTTP calls on-chain: APIs, price feeds, webhooks

---

### What it teaches

The HTTP Call precompile. Short-running async model: result arrives in the same transaction via `spcCalls`.

Short-running async: result in same TX

### Key patterns

*   `SECRET` string replacement for API keys
*   `piiEnabled` flag for secret string replacement and PII redaction
*   JQ post-processing via the JQ precompile (0x0803)
*   Method codes: GET=1, POST=2, PUT=3, DELETE=4, PATCH=5
*   One short-running async call per TX. Cannot chain with LLM in same TX
