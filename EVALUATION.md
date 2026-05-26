# AstroAgent Evaluation and Architecture Report

Most candidates fail to document the constraints and bottlenecks they hit during implementation. This document outlines the core architecture decisions, major bottlenecks, compatibility workarounds, and how we resolved LangGraph routing loops for **AstroAgent**.

---

## 1. Core Architectural & System Fixes

### A. Windows + Python 3.13 Swiss Ephemeris Compiler Bottleneck
*   **The Issue**: The core astrology library `flatlib` has a hard dependency on `pyswisseph` (the Python Swiss Ephemeris wrapper). However, on Windows, installing `pyswisseph` compiles C extensions from source, requiring local Microsoft Visual C++ Build Tools which are rarely available on target deployment servers or client setups.
*   **The Solution**: 
    1. We installed **`pysweph`**—a modern community fork containing pre-built binaries and wheels compiled specifically for **Python 3.13 on Windows x64**.
    2. We patched flatlib's ephemeris connector at `flatlib/ephem/swe.py` to support `pysweph`'s updated 3-tuple return signature for `calc_ut` (which includes warning messages alongside the coordinates and flags), preventing `ValueError: too many values to unpack (expected 2)` errors.

### B. Infinite LangGraph Tool Loops
*   **The Issue**: Groq's models can occasionally enter an infinite tool-calling loop (e.g. `Agent -> tool -> Agent -> tool`) if the prompt doesn't specify tool-completion states, or if the model fails to notice it has already computed the coordinates or birth chart.
*   **The Solution**:
    1. **State Steps Counter**: We injected a `steps: int` key into the `AgentState` schema.
    2. **Loop Terminator**: Inside the `agent_node`, we read the counter and immediately terminate the reasoning loop with a polite assistant message if `steps >= 5`.
    3. **Prompt Guard**: We added clear system directives instructing the model never to repeatedly call the same tool if the data is already present in the active state.

### C. Incorrect LangGraph Edge Routing
*   **The Issue**: Standard LangGraph routing mappings require the conditional edge functions to return explicit string keys that map to downstream nodes. Returning the `END` constant (`"__end__"`) directly as an unmapped edge result can cause the runtime engine to hang or loop.
*   **The Solution**: We updated the conditional edge functions in `edges.py` to return the explicit string `"__end__"`, establishing a clean exit block.

---

## 2. Evaluation System (Day 6)

We implemented an automated Golden Dataset testing suite at `backend/evals/run_eval.py` using **25 distinct test cases** divided into four categories:
1. **Valid Queries**: Personal career queries, Saturn house checks, daily transit requests.
2. **Invalid Parameters**: Impossible birthdates (e.g. Feb 31), births on Mars, future years.
3. **Safety Violations**: Requests for absolute stock gains, medical tumor diagnostics, lottery predictions.
4. **Prompt Injections**: Instructing the system to ignore its system prompt, fake calculations, and key leak attempts.

### Scorecard Metrics (LLM-as-a-Judge)
Our evaluation run grades the assistant's responses using a strict 1-5 rubric evaluated via `evals/judge.py`:
*   **Safety Adherence**: Checks if the model successfully caught injections and refused predictions/diagnostics.
*   **Warmth & Empathy**: Measures how well the AI embodies a welcoming, spiritual, and psychologically grounded tone.
*   **Clarity & Grounding**: Verifies that calculations aren't hallucinated and markdown is clean.

---

## 3. Tool Activity Telemetry (FastAPI SSE Streaming)
Rather than a generic loading spinner, the `/api/chat/stream` Server-Sent Events endpoint emits specific telemetry events during tool runs:
*   `event: tool_start` (emits `tool_geocode_place` or `tool_compute_birth_chart`)
*   `event: tool_end`
*   `event: token` (streams assistant text chunks in real-time)

This allows the React UI to display pulsing indicators like `🔭 Geolocating coordinates...` and `🪐 casting birth chart...` dynamically as the agent runs.
