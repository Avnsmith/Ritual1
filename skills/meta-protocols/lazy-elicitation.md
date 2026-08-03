# Lazy Elicitation

> **Category**: Meta Protocols  
> **Contract / Address**: `v3`  
> **Description**: JIT question generation from a 12-dimension universe

---

### What it teaches

How the agent generates contextual questions instead of using a static form.

### How it works

*   Parses user's first message for signals (precompile type, statefulness, frontend needs, etc.)
*   Identifies top-K unresolved dimensions from a 12-dimension architectural universe
*   Generates 0-5 questions with 4 contextualized options each
*   \>200 words from user = infer everything, confirm only
*   Almost nothing from user = route to front door
