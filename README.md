🧠 EduVision: AI-Powered Predictive Education Analytics

EduVision is a high-performance MERN stack application designed to revolutionize how educators interact with student data. By combining Random Forest Machine Learning with Generative AI (Gemini & Mistral), the platform predicts student success, identifies at-risk learners, and provides a conversational interface for deep data insights.

🚀 Key Features
📊 1. Predictive Analytics Engine
ML Model: Utilizes a Scikit-learn based Random Forest Classifier to analyze study patterns and academic behavior.
Completion Probability: Predicts the likelihood of students successfully completing courses based on historical performance data.
Risk Categorization: Automatically classifies students into High, Medium, or Low Risk groups for early intervention strategies.
🤖 2. Dual-Engine AI Mentor
Google Gemini 1.5 Flash: Provides high-speed reasoning and intelligent responses for complex educational queries.
Hugging Face (Mistral-7B): Open-source LLM integration for context-aware academic assistance.
Data-Grounded Conversations: AI chatbot can analyze uploaded CSV and Excel datasets to answer specific questions related to student performance and analytics.
🎨 3. Premium Analytics Dashboard
Modern UI: Sleek dark-themed interface built using React.js.
Real-Time Data Visualization: Interactive charts, performance graphs, and risk tables update instantly after file uploads.
Smart File Processing: Supports both CSV and Excel (.xlsx) file formats for seamless data analysis.
🔐 4. Secure Authentication System
JWT-Based Authentication: Secure login and signup functionality using JSON Web Tokens.
Password Recovery System: Integrated forgot-password workflow using Nodemailer and secure reset tokens.
Protected Routes: Dashboard and analytics pages accessible only to authenticated users.
🛠️ Tech Stack
Layer Technology
Frontend React.js, React Router, Axios, CSS
Backend Node.js, Express.js
Database MongoDB Atlas
AI / ML Scikit-learn, Google Gemini API, Hugging Face API
Libraries & Tools Multer, XLSX, Nodemailer, bcryptjs, JWT
📁 Project Structure
EduVision/
│
├── client/ # React Frontend
│ ├── src/
│ │ ├── components/ # UI Components
│ │ │ ├── Auth/
│ │ │ ├── Dashboard/
│ │ │ └── Chat/
│ │ ├── App.js # Main Routing & Logic
│ │ └── index.js
│
├── server/ # Node.js Backend
│ ├── models/ # MongoDB Schemas
│ ├── routes/ # API Endpoints
│ ├── middleware/ # JWT Middleware
│ └── server.js # Backend Entry Point
│
└── .env # Environment Variables
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/yourusername/EduVision.git
cd EduVision
2️⃣ Backend Setup
cd server
npm install

Create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_google_gemini_key
HF_ACCESS_TOKEN=your_huggingface_token

EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password

Start the backend server:

npm start
3️⃣ Frontend Setup
cd ../client
npm install
npm start
📈 Dataset Requirements

For accurate predictions, uploaded CSV or Excel files should contain the following columns:

Student_Name
Study_Hours_Per_Day
Attendance_Percentage
Previous_Scores
Extracurricular_Activities (Yes/No)
🛡️ Security Features
Secure password hashing using bcryptjs
JWT token-based authentication
Axios interceptors for automatic token handling
Protected API routes and dashboard access
🤝 Contribution

Developed by Rudraksh as an AI-powered educational analytics solution that combines full-stack web development with Machine Learning and Generative AI technologies.
