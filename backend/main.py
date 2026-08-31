
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ai-resume-checker-seven.vercel.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Skills for our 4 target jobs
JOB_SKILLS = {
    "Data Analyst": [
        "python", "sql", "excel", "power bi",
        "tableau", "statistics", "pandas"
    ],

    "Data Scientist": [
        "python", "sql", "machine learning",
        "statistics", "pandas", "numpy",
        "scikit-learn"
    ],

    "AI Engineer": [
        "python", "machine learning",
        "deep learning", "pytorch",
        "tensorflow", "nlp", "computer vision"
    ],

    "Web Developer": [
        "html", "css", "javascript",
        "react", "next.js", "node.js", "git"
    ]
}


# -----------------------------
# SIMPLE NAIVE BAYES AI MODEL
# -----------------------------

training_text = [
    "python sql excel pandas statistics power bi",
    "python sql machine learning pandas numpy scikit-learn",
    "python machine learning deep learning pytorch tensorflow nlp",
    "html css javascript react next.js node.js git",

    "cooking photography music painting",
    "football cricket gaming drawing",
    "history biology chemistry physics"
]

training_labels = [
    "Data Analyst",
    "Data Scientist",
    "AI Engineer",
    "Web Developer",

    "Other",
    "Other",
    "Other"
]

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(training_text)

model = MultinomialNB()
model.fit(X, training_labels)


@app.get("/")
def home():
    return {"message": "Resume AI is running!"}


def get_pdf_text(file):
    reader = PdfReader(io.BytesIO(file))

    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text.lower()


@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    job: str = Form(...),
    job_description: str = Form(...)
):

    # Read PDF
    file = await resume.read()

    # Extract resume text
    resume_text = get_pdf_text(file)

    # Required skills
    required_skills = JOB_SKILLS[job]

    # -----------------------------
    # SKILL MATCHING
    # -----------------------------

    matched = []

    for skill in required_skills:
        if skill in resume_text:
            matched.append(skill)

    missing = []

    for skill in required_skills:
        if skill not in resume_text:
            missing.append(skill)

    # ATS score
    score = (len(matched) / len(required_skills)) * 100

    # -----------------------------
    # NAIVE BAYES CLASSIFICATION
    # -----------------------------

    resume_vector = vectorizer.transform([resume_text])

    prediction = model.predict(resume_vector)[0]

    # Check whether the prediction matches selected job
    if prediction == job:
        suitability = "Suitable"
    else:
        suitability = "Needs Improvement"

    return {
        "job": job,
        "ats_score": round(score, 2),

        "matched_skills": matched,
        "missing_skills": missing,

        "ai_prediction": prediction,
        "suitability": suitability,

        "resume_text_length": len(resume_text),

        "message": "Resume analyzed successfully!"
    }
