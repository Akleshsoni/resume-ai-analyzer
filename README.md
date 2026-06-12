# 📄 Resume AI Analyzer

An AI-powered resume analysis tool that scores your resume against a job description, identifies missing skills, and gives actionable improvement suggestions — powered by **GPT-4o**.

Upload your resume (PDF), paste a job description, and get an instant ATS compatibility score with a detailed improvement plan.

---

## ✨ Key Features

- **ATS Match Score (0–100)** — visual score gauge showing how well your resume matches the JD
- **Missing Skills Detection** — exact keywords present in JD but absent from your resume
- **AI Improvement Plan** — GPT-4o generated, section-specific suggestions to increase your score
- **Recommended Roles** — AI suggests alternate job titles that fit your current profile
- **PDF Resume Parsing** — extracts text from uploaded PDF using `pdf-parse`
- **Results Persistence** — analyses stored in PostgreSQL via Drizzle ORM

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| UI | Shadcn/ui, Radix UI, Tailwind CSS, Framer Motion |
| State / Data | TanStack Query (React Query) |
| Backend | Express.js, Node.js |
| AI | OpenAI GPT-4o (JSON mode) |
| PDF Parsing | pdf-parse |
| Database | PostgreSQL + Drizzle ORM (Neon serverless) |
| File Uploads | Multer (in-memory storage) |

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js 18+
- PostgreSQL database (or [Neon](https://neon.tech) free tier)
- OpenAI API key

### Setup

```bash
# Clone the repository
git clone https://github.com/akleshsoni/resume-ai-analyzer.git
cd resume-ai-analyzer

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
```

Fill in your `.env`:
```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
NODE_ENV=development
```

### Database

```bash
npm run db:push
```

### Run

```bash
# Development (hot reload)
npm run dev

# Production
npm run build && npm start
```

Visit: `http://localhost:5000`

---

## 🔌 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Upload PDF resume + job description → returns analysis |

**Request:** `multipart/form-data`
- `resume` — PDF file
- `jobDescription` — string

**Response:**
```json
{
  "id": 1,
  "score": 74,
  "missingSkills": ["Docker", "Kubernetes", "GraphQL"],
  "suggestions": "• Add metrics to your work history\n• Highlight containerization experience",
  "recommendedRoles": ["Senior Frontend Engineer", "Full Stack Developer"],
  "createdAt": "2026-01-06T07:03:00Z"
}
```

---

## 🏗️ Project Structure

```
resume-ai-analyzer/
├── client/
│   └── src/
│       ├── pages/         # Home.tsx (upload), Results.tsx (analysis view)
│       ├── components/    # FileUpload, ScoreGauge
│       └── hooks/         # use-analysis.ts (API call logic)
├── server/
│   ├── index.ts           # Express app entry
│   ├── routes.ts          # /api/analyze — PDF parse → GPT-4o → DB store
│   └── storage.ts         # Drizzle ORM queries
├── shared/
│   ├── schema.ts          # analyses table schema
│   └── routes.ts          # Shared type-safe route definitions
└── package.json
```

---


## 👤 Author

**Aklesh Soni** — Final-year CS Engineering Student  
📧 [akleshsoni37@gmail.com](mailto:akleshsoni37@gmail.com) | 🌐 [akleshsoni.netlify.app](https://akleshsoni.netlify.app)
