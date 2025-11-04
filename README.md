# 💬 AI-Powered Interview Prep App

An AI-driven web application that simulates real job interviews using **Google Gemini**.  
Users upload their **resume** and **job description**, and the AI acts as an interviewer — asking questions, analyzing answers, and giving intelligent follow-up questions.

---

## 🚀 Overview

- **Resume + Job Description Upload**
- **AI Interview Simulation**
  - Generates 3 initial job-specific questions  
  - Evaluates user responses using resume context  
  - Asks smart, follow-up questions   
- **User Authentication (JWT)**  
- **Deployed Frontend (Vercel)** & **Backend (Render)**  

---

## 🧠 How It Works

1. User uploads their **resume** and **JD**.  
2. The AI (Gemini) analyzes both documents.  
3. It asks **three interview questions** tailored to the JD.  
4. As the user responds, the AI:
   - Evaluates each answer based on the resume.
5. All messages are saved in MongoDB for chat history.

---

## ⚙️ Tech Stack

**Frontend:** React + Tailwind CSS  
**Backend:** Node.js + Express + MongoDB  
**AI Model:** Google Gemini (via `@google/genai`)  
**Auth:** JWT  
**Hosting:** Vercel (frontend) & Render (backend)

---

## 🧩 Key Modules

- **AI Engine** – Powered by Gemini for question generation, evaluation & follow-ups  
- **Chat Module** – Manages user-AI conversation history  
- **Document Module** – Handles PDF upload and chunking  
- **Auth Module** – Secure login, signup, and session handling  

---

## 🧪 Run Locally

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev

🛠️ Future Enhancements
AI-based interview scoring

Voice input & speech feedback

Export chat as PDF report

Admin dashboard for session insights

👩‍💻 Author
Suparna A K
MERN Stack Developer 
📧 suparnaak@gmail.com
🌐 https://www.linkedin.com/in/suparna-a-k-385751282/