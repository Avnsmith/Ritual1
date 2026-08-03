# Circuit Breaker

> **Category**: Meta Protocols  
> **Description**: Trajectory divergence detection, knows when to stop

---

### What it teaches

Self-awareness for the agent: knowing when the current approach isn't converging.

### How it works

*   Weighted progress markers: chain connection (1), deploy (3), settle (5), E2E (8)
*   Stall thresholds by phase: scaffolding (3 turns), contracts (5), frontend (4), integration (6)
*   Immediate break on: error oscillation, scope creep into verified files, user frustration signals
*   Proposes: simplify scope / pivot architecture / pause and hand back
