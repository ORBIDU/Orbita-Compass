from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uvicorn
import os
import logging
from dotenv import load_dotenv

from scoring import calculate_scoring_metrics
from llm_pipeline import generate_llm_insights

load_dotenv()
logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Orbita Compass AI Engine API",
    description="Microservice AI for Student Profiling, Mathematical Scoring, and Gemini LLM Guidance",
    version="1.0.0"
)

# Enable CORS for browser integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.exception(f"Unhandled AI Engine exception on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"status": "error", "error": "Terjadi kesalahan internal pada layanan AI Engine", "detail": str(exc)}
    )

class AcademicRecordInput(BaseModel):
    semester: int
    subject: str
    score: float

class AchievementInput(BaseModel):
    title: str
    category: str
    level: str
    year: int

class AssessmentInput(BaseModel):
    technology: float = 70.0
    research: float = 70.0
    creativity: float = 70.0
    leadership: float = 70.0
    communication: float = 70.0

class ReflectionInput(BaseModel):
    interests: List[str] = Field(default_factory=list)
    careerGoals: List[str] = Field(default_factory=list)
    motivation: Optional[str] = None

class StudentPayload(BaseModel):
    student_id: str
    name: Optional[str] = "Student"
    grade: int = 12
    major_track: str = "IPA"
    target_ptn: str = "Universitas Indonesia"
    target_major: str = "Teknik Informatika"
    academic_records: List[AcademicRecordInput] = Field(default_factory=list)
    achievements: List[AchievementInput] = Field(default_factory=list)
    assessment: AssessmentInput = Field(default_factory=AssessmentInput)
    reflection: ReflectionInput = Field(default_factory=ReflectionInput)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Orbita Compass AI Engine",
        "gemini_api_configured": bool(os.getenv("GEMINI_API_KEY"))
    }

@app.post("/analyze-compass")
def analyze_compass(payload: StudentPayload):
    try:
        logging.info(f"Processing Compass AI analysis for student: {payload.student_id} ({payload.target_major})")
        
        # Convert models to dict safely
        academic_list = [r.model_dump() for r in payload.academic_records]
        achievement_list = [a.model_dump() for a in payload.achievements]
        assessment_dict = payload.assessment.model_dump()
        
        # 1. Execute Mathematical Scoring Algorithm
        confidence_score, interest_align, competency_align, alignment_status, strengths = calculate_scoring_metrics(
            academic_records=academic_list,
            achievements=achievement_list,
            assessment=assessment_dict,
            target_major=payload.target_major
        )

        # 2. Execute LLM Prompting Pipeline
        student_dict = payload.model_dump()
        insights = generate_llm_insights(
            student_data=student_dict,
            confidence_score=confidence_score,
            alignment_status=alignment_status,
            strengths=strengths
        )

        return {
            "status": "success",
            "student_id": payload.student_id,
            "confidence_score": confidence_score,
            "interest_alignment_pct": interest_align,
            "competency_alignment_pct": competency_align,
            "career_alignment_status": alignment_status,
            "top_strengths": strengths,
            "ai_summary": insights.get("ai_summary", ""),
            "recommended_majors": insights.get("recommended_majors", []),
            "recommended_univs": insights.get("recommended_univs", []),
            "recommended_careers": insights.get("recommended_careers", [])
        }
    except Exception as e:
        logging.exception(f"Error in analyze_compass: {e}")
        raise HTTPException(status_code=500, detail=f"AI Engine processing failed: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
