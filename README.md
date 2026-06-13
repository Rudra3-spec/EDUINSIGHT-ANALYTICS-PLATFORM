# EduInsight Analytics Platform

EduInsight is a full-stack educational analytics dashboard that helps teachers turn student activity data into actionable insights. Upload a CSV or Excel file to identify at-risk students, estimate course completion probability, compare chapter difficulty, review previous analyses, and ask questions through an AI mentor.

## Features

- **Student risk analysis** - classifies students as high, medium, or low risk.
- **Completion estimates** - calculates a completion probability from scores and time spent.
- **Chapter analytics** - highlights difficult chapters using average scores, time spent, and completion rates.
- **Interactive dashboard** - includes overview cards, charts, tables, and a downloadable report.
- **AI mentor** - uses Google Gemini when configured and falls back to a built-in offline analyser.
- **Secure accounts** - supports signup, login, JWT-protected routes, and password recovery.
- **File history** - stores each teacher's uploads and allows previous files to be analysed again.
- **CSV and Excel support** - accepts `.csv`, `.xls`, and `.xlsx` files.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, React Router, Axios, Recharts |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Analytics | Python, pandas |
| AI assistant | Google Gemini API with an offline fallback |
| File and email services | Multer, Nodemailer |

## Project Structure

```text
.
|-- client/                 # React frontend
|   |-- public/
|   `-- src/
|       `-- components/     # Dashboard, auth, upload, report, and chat UI
|-- server/                 # Express API
|   |-- controllers/
|   |-- middleware/
|   |-- models/             # User, file, and student schemas
|   |-- routes/             # Authentication, uploads, analytics, and chat
|   `-- ml_predict.py       # Python analytics pipeline
|-- ML/                     # Experiments, datasets, notebooks, and model artifacts
`-- README.md
```

## Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) 18 or newer
- [Python](https://www.python.org/) 3.9 or newer
- [MongoDB](https://www.mongodb.com/) locally, or a MongoDB Atlas connection string

The backend starts Python with the `python` command, so make sure it is available on your `PATH`.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Rudra3-spec/EDUINSIGHT-ANALYTICS-PLATFORM.git
cd EDUINSIGHT-ANALYTICS-PLATFORM
```

### 2. Install backend dependencies

```bash
cd server
npm install
python -m pip install pandas openpyxl xlrd
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/learning_tool
JWT_SECRET=replace_with_a_long_random_secret

# Optional: enables Gemini responses. The built-in analyser works without it.
GEMINI_API_KEY=

# Optional: required only for password-recovery emails.
EMAIL_USER=
EMAIL_PASS=
```

Start the API:

```bash
npm run dev
```

Use `npm start` instead if you do not want automatic restarts.

### 3. Install frontend dependencies

Open a second terminal:

```bash
cd client
npm install
npm start
```

The application will open at `http://localhost:3000`. By default, it connects to the deployed API at `https://eduinsight-backend-final.onrender.com`.

For a backend hosted at another URL, create `client/.env`:

```env
REACT_APP_API_URL=https://eduinsight-backend-final.onrender.com
```

Restart the React development server after changing environment variables.

For local backend development, use `REACT_APP_API_URL=http://localhost:5000`.

## Dataset Format

Every uploaded file must contain these columns:

| Column | Description | Example |
| --- | --- | --- |
| `student_id` | Unique student identifier | `101` |
| `chapter_order` | Chapter number or sequence | `3` |
| `time_spent` | Time spent on the chapter in minutes | `58` |
| `score` | Student score on a 0-100 scale | `76` |

Example CSV:

```csv
student_id,chapter_order,time_spent,score
101,1,45,82
101,2,62,74
102,1,18,46
102,2,25,51
103,1,70,91
103,2,68,88
```

Column names are trimmed and converted to lowercase during processing. Rows missing `chapter_order`, `time_spent`, or `score` are ignored.

## How Analysis Works

The Python service calculates a completion probability for each row using:

- score, weighted at 70%;
- time spent, weighted at 30%, with a preferred range for productive engagement;
- a small bonus for scores of 80 or higher.

Results are averaged per student and assigned a risk level:

| Completion probability | Risk level |
| --- | --- |
| Below 40% | High |
| 40% to below 70% | Medium |
| 70% and above | Low |

Chapter difficulty is calculated from the chapter's average score. This is a transparent heuristic intended for decision support, not a validated clinical or academic assessment.

## Available Scripts

Run these commands from the corresponding directory:

| Directory | Command | Purpose |
| --- | --- | --- |
| `client` | `npm start` | Start the React development server |
| `client` | `npm test` | Run frontend tests |
| `client` | `npm run build` | Create a production frontend build |
| `server` | `npm run dev` | Start the API with Nodemon |
| `server` | `npm start` | Start the API with Node.js |

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Create an account |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `POST` | `/api/auth/forgot-password` | Send a password-reset email |
| `POST` | `/api/auth/reset-password/:token` | Set a new password |
| `POST` | `/api/upload` | Upload and analyse a dataset |
| `POST` | `/api/analyze-previous` | Reanalyse a saved upload |
| `GET` | `/api/previous-files` | List the current user's uploads |
| `DELETE` | `/api/clear` | Clear the current user's upload history |
| `GET` | `/api/students` | Analyse students from the latest upload |
| `POST` | `/api/chat/gemini` | Ask the AI mentor about analysis results |

Protected endpoints expect the JWT in the `x-auth-token` header.

## Troubleshooting

- **MongoDB connection fails:** confirm MongoDB is running or verify `MONGO_URI`.
- **Python is not found:** add Python to `PATH` and confirm `python --version` works.
- **Excel upload fails:** install `openpyxl` for `.xlsx` and `xlrd` for `.xls`.
- **Upload returns missing columns:** check that all four required column names are present.
- **Password email fails:** use valid SMTP credentials; Gmail accounts normally require an app password.
- **Gemini is unavailable:** the mentor automatically switches to its built-in data analyser.

## Security Notes

- Never commit `.env` files, API keys, email credentials, or production secrets.
- Replace the development JWT fallback with a strong `JWT_SECRET`.
- Restrict CORS origins and configure public URLs before deploying.
- Uploaded files are stored in `server/uploads`; define an appropriate retention policy for production use.

## Author

Developed by [Rudra3-spec](https://github.com/Rudra3-spec).
