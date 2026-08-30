"use client";

import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [job, setJob] = useState("Data Analyst");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function analyzeResume() {
    if (!resume) {
      alert("Please upload your resume PDF.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter the job description.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();

    formData.append("resume", resume);
    formData.append("job", job);
    formData.append("job_description", jobDescription);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert(
        "Could not connect to Python backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium text-zinc-400">
            RESUME AI
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Make your resume
            <br />
            <span className="text-zinc-500">
              job-ready.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-zinc-400">
            Upload your resume, select a target job and
            compare your resume with the job requirements.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl md:p-8">

          {/* Resume Upload */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium">
              Resume PDF
            </label>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setResume(file);
                  setResult(null);
                }
              }}
            />

            <label
              htmlFor="resume-upload"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-10 text-center transition hover:border-zinc-400"
            >
              <div className="mb-4 text-4xl">
                📄
              </div>

              {resume ? (
                <>
                  <p className="font-medium">
                    {resume.name}
                  </p>

                  <p className="mt-2 text-sm text-zinc-500">
                    {(resume.size / 1024).toFixed(1)} KB
                  </p>

                  <p className="mt-3 text-xs text-zinc-600">
                    Click to choose another PDF
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">
                    Click to upload your resume
                  </p>

                  <p className="mt-2 text-sm text-zinc-500">
                    PDF files only
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Target Job */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium">
              Target Job
            </label>

            <select
              value={job}
              onChange={(e) => setJob(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none focus:border-zinc-400"
            >
              <option>Data Analyst</option>
              <option>Data Scientist</option>
              <option>AI Engineer</option>
              <option>Web Developer</option>
            </select>
          </div>

          {/* Job Description */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium">
              Job Description
            </label>

            <textarea
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(e.target.value)
              }
              placeholder="Paste the job description here..."
              className="min-h-48 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm outline-none placeholder:text-zinc-600 focus:border-zinc-400"
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={analyzeResume}
            disabled={loading}
            className="w-full rounded-xl bg-white py-4 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Analyzing Resume..."
              : "Analyze Resume →"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">

            <h2 className="text-2xl font-bold">
              Analysis Results
            </h2>

            {/* Score */}
            <div className="mt-6 rounded-2xl bg-zinc-950 p-8 text-center">
              <p className="text-sm text-zinc-500">
                ATS COMPATIBILITY
              </p>

              <p className="mt-2 text-6xl font-bold">
                {result.ats_score}%
              </p>
            </div>

            {/* Skills */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {/* Matched */}
              <div>
                <h3 className="mb-3 font-semibold">
                  ✓ Matched Skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {result.matched_skills.length > 0 ? (
                    result.matched_skills.map(
                      (skill: string) => (
                        <span
                          key={skill}
                          className="rounded-full bg-zinc-800 px-3 py-2 text-sm"
                        >
                          {skill}
                        </span>
                      )
                    )
                  ) : (
                    <p className="text-sm text-zinc-500">
                      No matching skills found.
                    </p>
                  )}
                </div>
              </div>

              {/* Missing */}
              <div>
                <h3 className="mb-3 font-semibold">
                  + Missing Skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {result.missing_skills.length > 0 ? (
                    result.missing_skills.map(
                      (skill: string) => (
                        <span
                          key={skill}
                          className="rounded-full border border-zinc-700 px-3 py-2 text-sm text-zinc-400"
                        >
                          {skill}
                        </span>
                      )
                    )
                  ) : (
                    <p className="text-sm text-zinc-500">
                      No missing skills detected.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="mt-8">
              <h3 className="mb-3 font-semibold">
                Suggestions
              </h3>

              <div className="rounded-xl bg-zinc-950 p-4 text-sm text-zinc-400">
                {result.missing_skills.length > 0
                  ? `Consider developing or highlighting: ${result.missing_skills.join(
                      ", "
                    )}`
                  : "Your resume contains the main skills for this target job."}
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}