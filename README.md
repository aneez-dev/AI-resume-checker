# AI Resume Checker

AI-powered resume analysis web application that evaluates a resume against a target job and provides an ATS compatibility score, matched skills, missing skills, and Naive Bayes-based job classification.

## Live Demo

🔗 **https://ai-resume-checker-seven.vercel.app/**

## Features

* Upload a resume in PDF format
* Extract resume text automatically
* Select a target job
* Compare resume skills with job requirements
* Calculate ATS compatibility score
* Identify matched and missing skills
* Use TF-IDF for text feature extraction
* Use Naive Bayes for resume job-category classification
* Display analysis results through a simple web interface

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Python
* FastAPI
* PyPDF
* Scikit-learn

### Machine Learning

* TF-IDF Vectorization
* Multinomial Naive Bayes

## How It Works

```text
User uploads resume PDF
        ↓
Next.js frontend
        ↓
FastAPI backend
        ↓
PDF text extraction
        ↓
Skill matching + ATS score
        ↓
TF-IDF text vectorization
        ↓
Naive Bayes classification
        ↓
Analysis results
        ↓
Displayed on frontend
```

## ATS Score

The ATS score represents how many of the predefined skills for the selected job are found in the resume.

```text
ATS Score = (Matched Skills / Required Skills) × 100
```

For example, if 6 out of 7 required skills are found:

```text
ATS Score = 85.71%
```

## Supported Job Categories

* Data Analyst
* Data Scientist
* AI Engineer
* Web Developer

## Project Structure

```text
AI-resume-checker/
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── package.json
│   └── tsconfig.json
│
└── .gitignore
```

## Running Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## Note

This project is an educational prototype. The ATS score is based on predefined job skills, while the Naive Bayes model is trained on a small sample dataset. It is not intended to replicate the proprietary scoring systems used by commercial ATS platforms.
