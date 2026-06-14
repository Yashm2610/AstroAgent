# AstroAgent 🌌

AstroAgent is a premium AI-driven astrological consultation platform. It integrates astronomical mathematical calculations (via `flatlib` and Swiss Ephemeris), geocoding/timezone resolvers, and advanced reasoning loops built on **LangGraph** to deliver deep, personalized, and psychologically grounded astrological insights.

---

## 🎨 Premium UI/UX Overhaul Features

AstroAgent's front-end client has been upgraded with a high-fidelity cosmic theme:
* **Interactive SVG AstroWheel**: Renders a dynamic, mathematically accurate circular birth chart wheel placing celestial glyphs inside their respective Placidus houses.
* **Elemental Balance Analyzer**: Computes the distribution of Fire, Earth, Air, and Water elements based on your birth coordinates and key planetary alignments.
* **Suggested Consultation Prompts**: Tap quick-select chips to instantly analyze Saturn transits, Sun sign lessons, or 10th house career paths.
* **Clickable Planetary Interpretations**: Click any planet row in the sidebar to open a detailed modal overlay showing planet dynamics, sign expressions, and a synthesized advisory note.
* **Web Audio API Chime Synth**: Synthesizes custom harmonic sine-wave chimes for chart generation and incoming message notifications with a global mute toggle.
* **Dynamic Cosmic Theme Switcher**: Toggle between Cosmic Indigo (default dark), Deep Nebula (rich violet/plum), and Lunar Silver (cool steel grey) visual themes.
* **Reasoning Activity Logs**: Real-time HUD-style progression tracker indicating backend calculation steps (geolocating, chart computation, RAG database lookup).
* **Collapsible Space-Time Layout**: Toggle sidebar blueprints on desktop and mobile viewports to maximize writing area.
* **CSS Starry Sky Backdrop**: Smoothly animated parallax stars background and micro-interactions powered by `framer-motion`.
* **Celestial Oracle Deck**: Draw a daily card for meditation and spiritual focus.
* **Vedic Grid Chart Layout**: Alternate layout style toggling standard Western circle wheel to South Indian square-style chart.
* **Star Map Coordinates HUD**: Live Right Ascension (RA) and Declination (Dec) values calculated and rendered dynamically.
* **Astro-Journal Bookmarks**: message-level bookmarking, persisting saved notes, chat responses, and readings.
* **Planet Aspect Grid Matrix**: Geometric relationships (Conjunction, Square, Trine, Opposition, Sextile) between planets.
* **Moon Phase Widget**: Visual moon phase age, illumination, and calendar representation.
* **Soundscape Options & Master Volume**: Master volume sliders and distinct ambient tracks (Cosmic Drone, Solfeggio 528Hz, Theta Waves).
* **Downloadable Chart SVG**: Export chart SVG instantly.
* **Typography pairing configurator**: Global selector to switch Classic Serif, Space Monospace, and Sans-serif styles.
* **Accessibility glow toggler**: Ability to disable high-performance CSS animations (mouse trail, twinkling stars) for accessibility.
* **Onboarding tutorial wizard**: Welcomes users with a step-by-step walkthrough of client panels.
* **Profile switcher history**: Allows saving multiple birth profiles to quickly prefill parameters.
* **Emoji reaction tray**: Direct reactions (✨, 🪐, 🔮, 🙏) on message bubbles.
* **Interactive glossary**: Comprehensive definitions of astrological terminology.

---

## 🗺️ System Architecture

```mermaid
graph TD
    User([User Client]) -->|1. Submit birth details| API[FastAPI Server]
    API -->|2. Geocode & Compute Chart| Engine[Astrology Engine: Flatlib/pysweph]
    Engine -->|3. Save Profile| DB[(SQLite DB)]
    
    User -->|4. Ask career/transit question| API
    API -->|5. Initialize State & Run| Graph[LangGraph Workflow]
    
    subgraph LangGraph Reasoning Loop
        Graph --> Router{Router Node}
        Router -->|valid query| Agent[Agent Node]
        Router -->|invalid / unsafe| Refusal[Refusal Node]
        
        Agent -->|decide tool call| Tools[Tools Node]
        Tools -->|geocode / chart / transits / RAG| Agent
        Agent -->|finalize response| End[__end__]
    end
    
    Graph -->|6. Yield SSE chunks & status| API
    API -->|7. Token-by-token stream| User
```

---

## 📁 Repository Structure

```text
astroagent/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/      # Chat and birth details endpoints
│   │   │   └── schemas/     # Pydantic schemas
│   │   ├── database/        # SQLite models.py and sqlite.db
│   │   ├── graph/           # LangGraph builder, nodes, state, and edges
│   │   ├── services/        # LLM client, DB service, and SSE streaming
│   │   ├── tools/           # Geocode, birth chart, transits, and local RAG
│   │   └── main.py          # FastAPI application entrypoint
│   ├── evals/               # Evaluation datasets, judge prompts, and runner
│   ├── tests/               # Local test suite (tools, agents, patch verification)
│   ├── requirements.txt     # Python backend dependencies
│   └── .env                 # Environment configurations (API keys)
└── frontend/
    ├── src/
    │   ├── components/      # Birth details form, chat window, and tool activity
    │   ├── pages/           # Home Landing and Chat pages
    │   ├── store/           # Zustand state store (chatStore.js)
    │   ├── hooks/           # useStreaming.js EventSource hook
    │   └── App.jsx          # Screen switcher and session controller
    ├── tailwind.config.js   // Tailwind CSS configuration
    └── package.json         // Frontend dependencies
```

---

## 🛠️ Setup & Running Instructions

### 1. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
PORT=8000
HOST=0.0.0.0
```

### 2. Start the Backend
From the `backend/` directory:
```bash
# Initialize virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies (incorporates pysweph and flatlib compatibility)
pip install -r requirements.txt
pip install pysweph
pip install flatlib --no-deps
pip install geopy timezonefinder tzdata

# Start FastAPI server
uvicorn app.main:app --reload
```
The server starts on `http://localhost:8000`.

### 3. Start the Frontend
From the `frontend/` directory:
```bash
# Install NPM packages
npm install

# Start Vite dev server
npm run dev
```
The client opens on `http://localhost:5173`.

---

## 🧪 Testing and Evaluations

### Local Integration Verification
Before running the full suite, verify that the router and agent tools execute without loops:
```bash
cd backend
venv\Scripts\python tests\test_agent.py
```

### Run Evaluation Suite
Execute the Golden Dataset runner (25 test cases graded via LLM-as-a-judge):
```bash
cd backend
venv\Scripts\python evals\run_eval.py
```
This writes individual test scores to `evals/results.csv` and outputs an ASCII evaluation report to `evals/scorecard.txt`.
