# HirePrepAI 🎯

> **Beat ATS. Get Shortlisted.** — AI-powered resume skill gap analyser with a personalised week-by-week learning roadmap.

HirePrepAI analyses your resume against any job title or job description, identifies skill gaps, calculates an ATS match score, and generates a tailored roadmap using local LLMs. **No account required** — sign in with Google to optionally save your analysis history.

---

## ✨ Features

| Feature | Details |
|---|---|
| **ATS Match Score** | Semantic similarity scoring via `BAAI/bge-base-en-v1.5` |
| **Skill Gap Detection** | Resume skills vs JD skills extracted by `all-MiniLM-L6-v2` |
| **Job Title → Skills** | Fine-tuned `DistilBERT` predicts required skills from a job title |
| **Roadmap Generation** | Week-by-week learning plan via local `llama3.2` (Ollama) |
| **Real-time Progress** | Server-Sent Events stream 5 pipeline steps live to the UI |
| **Analysis History** | Optional Google OAuth — past analyses saved to Supabase Postgres |
| **Light / Dark Mode** | Persistent theme toggle across all pages |
| **Performance Dashboard** | Live model evaluation with accuracy gauges at `/performance` |
| **No Forced Login** | Upload and analyse without any account — history is opt-in |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js Frontend                      │
│  /upload → /analyze (SSE) → /results → /history             │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP / SSE
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Backend (main.py)                │
│                                                              │
│  POST /analyze                                               │
│    ├── PyMuPDF         → PDF text extraction                 │
│    ├── MiniLM          → Resume skill extraction             │
│    ├── DistilBERT      → JD title → required skills          │
│    ├── BAAI/bge-base   → Semantic gap scoring                │
│    └── Ollama llama3.2 → Roadmap generation (local LLM)      │
│                                                              │
│  GET /evaluate         → Live model benchmarks               │
│  GET /health           → Server + Ollama status              │
└───────────────────────────┬─────────────────────────────────┘
                            │ supabase-py (service role key)
                            ▼
                    Supabase Postgres
                  (analysis_history table)
```

---

## 🛠️ Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Python | ≥ 3.11 | Backend runtime |
| Node.js | ≥ 18 | Next.js frontend |
| npm | ≥ 9 | Package manager |
| [Ollama](https://ollama.com) | Latest | Local LLM inference |
| Supabase account | Free tier | Auth + Postgres (optional) |

---

## 📁 Project Structure

```
New Model hireprep/
├── main.py                  # FastAPI app — all HTTP endpoints
├── pipeline.py              # 5-step analysis pipeline
├── skill_extractor.py       # MiniLM resume skill extraction
├── predict_skill.py         # DistilBERT job title → skills
├── gap_scorer.py            # BAAI/bge semantic gap scoring
├── ollama_roadmap.py        # Ollama llama3.2 roadmap generation
├── evaluate.py              # Model benchmarking suite
├── supabase_client.py       # Supabase integration (history save)
├── supabase_schema.sql      # Database schema — run once in Supabase
├── jd-skill-predictor/      # Fine-tuned DistilBERT model weights
├── mlb.pkl                  # Multi-label binarizer for DistilBERT
├── .env                     # Backend secrets (Supabase)
└── frontend/                # Next.js 16 app
    ├── src/app/
    │   ├── page.tsx         # Landing page
    │   ├── upload/          # Resume + job input form
    │   ├── analyze/         # Real-time SSE progress animation
    │   ├── results/         # Skill gap + roadmap display
    │   ├── history/         # Analysis history dashboard
    │   ├── performance/     # Live model evaluation dashboard
    │   ├── how-it-works/    # End-to-end explainer page
    │   └── auth/callback/   # Google OAuth redirect handler
    ├── src/store/           # Zustand stores (upload, result, auth, theme)
    ├── src/lib/supabase.ts  # Supabase browser client
    └── .env.local           # Frontend env vars
```

---

## ⚙️ Setup

### 1. Clone / Open the project

```bash
cd "New Model hireprep"
```

---

### 2. Pull the Ollama model

```bash
# Install Ollama from https://ollama.com if not already installed
ollama pull llama3.2
```

---

### 3. Backend — Python environment

```bash
# Create a virtual environment (recommended)
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn[standard] pymupdf sentence-transformers \
            transformers torch scikit-learn numpy supabase python-dotenv
```

> **GPU support (optional):** If you have an NVIDIA GPU with CUDA, install the CUDA-enabled version of PyTorch from https://pytorch.org/get-started/locally/ for faster inference. CPU works fine without it.

---

### 4. Configure backend environment

Create `.env` in the project root (already present if you followed setup):

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> If you don't want Supabase, leave these blank — analysis still works, history saving is silently skipped.

---

### 5. Frontend — Node environment

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

---

### 6. Supabase — Database schema (optional, for history)

1. Go to **Supabase Dashboard → SQL Editor → New Query**
2. Paste the contents of [`supabase_schema.sql`](./supabase_schema.sql)
3. Click **Run**

To enable Google OAuth:
1. **Supabase Dashboard → Authentication → Providers → Google**
2. Toggle on, paste your **Google Cloud OAuth 2.0 Client ID** and **Secret**
3. Add the redirect URL to Google Cloud Console:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```

---

## 🚀 Running the Project

Open **two terminals**:

### Terminal 1 — FastAPI Backend

```bash
# From project root (with venv active)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Expected startup output:
```
CUDA GPU Available: True/False
Loading skill extractor (MiniLM)...
Loading JD predictor (DistilBERT)...
Loading gap scorer (BAAI/bge)...
All models loaded. Starting FastAPI server...
```

### Terminal 2 — Next.js Frontend

```bash
cd frontend
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## 🔌 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/health` | `GET` | Server + Ollama status check |
| `/analyze` | `POST` | Full pipeline — resume PDF + job title/JD |
| `/evaluate` | `GET` | Benchmark all 3 ML models (takes 30–120s) |

### `POST /analyze` — Form fields

| Field | Type | Required | Description |
|---|---|---|---|
| `resume_pdf` | `file` | ✅ | PDF resume file |
| `job_title` | `string` | One of these | e.g. `"Data Scientist"` |
| `jd_text` | `string` | One of these | Raw job description text |
| `stream` | `boolean` | ❌ | `true` for SSE step events |
| `user_id` | `string` | ❌ | Supabase user UUID for history saving |

---

## 📊 ML Models Used

| Model | Role | Source |
|---|---|---|
| `all-MiniLM-L6-v2` | Resume skill extraction via semantic anchors | HuggingFace |
| `BAAI/bge-base-en-v1.5` | Semantic gap scoring — resume vs JD skills | HuggingFace |
| `jd-skill-predictor` | Job title → required skills (fine-tuned DistilBERT) | Local (`./jd-skill-predictor/`) |
| `llama3.2` | Week-by-week learning roadmap generation | Ollama (local) |

---

## 🌐 Frontend Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/upload` | Public | Upload resume + enter job info |
| `/analyze` | Public | Live SSE pipeline progress |
| `/results` | Public | Skill gap analysis + roadmap |
| `/history` | Auth (optional) | Past analysis cards |
| `/performance` | Public | Live model benchmark dashboard |
| `/how-it-works` | Public | End-to-end pipeline explainer |
| `/auth/callback` | — | Google OAuth redirect handler |

---

## 🔧 Troubleshooting

### Backend won't start
- Make sure all pip packages are installed in the correct Python environment
- Ensure the `jd-skill-predictor/` folder exists with model weights and `config.json`
- Ensure `mlb.pkl` is present in the project root

### Ollama roadmap fails
```bash
ollama serve        # make sure Ollama is running
ollama list         # verify llama3.2 is pulled
ollama pull llama3.2
```

### History not saving
- Check that `SUPABASE_URL` has no `/rest/v1/` suffix
- Verify `SUPABASE_SERVICE_ROLE_KEY` starts with `eyJ...` (it's a JWT, not the anon key)
- Run the SQL schema in Supabase SQL Editor
- Check terminal for `[Supabase] WARNING:` logs

### Frontend build error
```bash
cd frontend
npm install
npm run build     # check TypeScript errors
```

### CORS errors in browser
Make sure `main.py` allows `http://localhost:3000` in `allow_origins` — it does by default.

---

## 🧪 Running Model Evaluation

With the backend running:
```
GET http://localhost:8000/evaluate
```
Or visit **http://localhost:3000/performance** in the browser for the visual dashboard.

> ⚠️ Evaluation can take 30–120 seconds — it loads all models and runs inference benchmarks.

---

## 📄 License

This project is a Final Year Project (FYP) and is for educational/demonstration purposes.
