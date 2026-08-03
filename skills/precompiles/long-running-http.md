# Long-Running HTTP

> **Category**: Precompile Features  
> **Contract / Address**: `0x0805`  
> **Description**: Minutes-to-hours async HTTP jobs with polling

---

### What it teaches

The Long HTTP precompile for operations that take minutes to hours.

Long-running async: submit/poll/deliver

### Key patterns

*   Submit → poll → deliver with JQ extraction
*   `pollIntervalBlocks` + `maxPollBlock` configuration
*   `taskIdMarker` for result identification
*   Scheduler integration for recurring long jobs
