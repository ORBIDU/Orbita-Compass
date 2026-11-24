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

tags_metadata = [
    {
        "name": "System Health",
        "description": "Endpoint status dan pemeriksaan konfigurasi API key Gemini",
    },
    {
        "name": "Compass AI Analytics",
        "description": "Microservice AI untuk kalkulasi skor numerik NumPy dan analisis rekomendasi Gemini 2.0 Flash",
    },
]

app = FastAPI(
    title="ORBIDU Compass AI Engine API",
    description="Microservice AI & Scoring Engine berbasis Python FastAPI + NumPy + Gemini 2.0 Flash untuk Analisis Keselarasan Minat, Bakat, dan Rapor Siswa SMA/SMK/MA Indonesia.",
    version="1.0.0",
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc"
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
    semester: int = Field(..., json_schema_extra={'example': 5}, description="Semester 1 hingga 5")
    subject: str = Field(..., json_schema_extra={'example': "Matematika"}, description="Nama mata pelajaran")
    score: float = Field(..., json_schema_extra={'example': 92.5}, description="Nilai rapor (0-100)")

class AchievementInput(BaseModel):
    title: str = Field(..., json_schema_extra={'example': "Juara 1 OSN Informatika"}, description="Judul prestasi/sertifikat")
    category: str = Field(..., json_schema_extra={'example': "Akademik"}, description="Kategori: Akademik | Non-Akademik")
    level: str = Field(..., json_schema_extra={'example': "Nasional"}, description="Tingkat: Kota | Provinsi | Nasional | Internasional")
    year: int = Field(..., json_schema_extra={'example': 2025}, description="Tahun perolehan")

class AssessmentInput(BaseModel):
    technology: float = Field(80.0, json_schema_extra={'example': 85.0}, description="Skor dimensi Teknologi (0-100)")
    research: float = Field(75.0, json_schema_extra={'example': 78.0}, description="Skor dimensi Riset & Analisis (0-100)")
    creativity: float = Field(70.0, json_schema_extra={'example': 72.0}, description="Skor dimensi Kreativitas (0-100)")
    leadership: float = Field(85.0, json_schema_extra={'example': 88.0}, description="Skor dimensi Kepemimpinan (0-100)")
    communication: float = Field(90.0, json_schema_extra={'example': 90.0}, description="Skor dimensi Komunikasi (0-100)")

class ReflectionInput(BaseModel):
    interests: List[str] = Field(default_factory=lambda: ["Pemrograman", "Kecerdasan Buatan"], json_schema_extra={'example': ["Pemrograman", "Kecerdasan Buatan"]})
    careerGoals: List[str] = Field(default_factory=lambda: ["Software Engineer", "Data Scientist"], json_schema_extra={'example': ["Software Engineer", "Data Scientist"]})
    motivation: Optional[str] = Field("Ingin memajukan teknologi digital Indonesia", json_schema_extra={'example': "Ingin memajukan teknologi digital Indonesia"})

class StudentPayload(BaseModel):
    student_id: str = Field(..., json_schema_extra={'example': "std-12345"}, description="ID unik siswa")
    name: Optional[str] = Field("Ahmad Rizki", json_schema_extra={'example': "Ahmad Rizki"})
    grade: int = Field(12, json_schema_extra={'example': 12}, description="Kelas siswa (10, 11, atau 12)")
    major_track: str = Field("IPA", json_schema_extra={'example': "IPA"}, description="Jurusan SMA: IPA | IPS | Bahasa | SMK")
    target_ptn: str = Field("Universitas Indonesia", json_schema_extra={'example': "Universitas Indonesia"}, description="Target PTN impian")
    target_major: str = Field("Teknik Informatika", json_schema_extra={'example': "Teknik Informatika"}, description="Target Program Studi")
    academic_records: List[AcademicRecordInput] = Field(default_factory=list)
    achievements: List[AchievementInput] = Field(default_factory=list)
    assessment: AssessmentInput = Field(default_factory=AssessmentInput)
    reflection: ReflectionInput = Field(default_factory=ReflectionInput)

@app.get("/health", tags=["System Health"])
def health_check():
    """
    Status kesehatan microservice AI Engine dan pemeriksaan validitas Gemini API Key.
    """
    return {
        "status": "ok",
        "service": "ORBIDU Compass AI Engine",
        "gemini_api_configured": bool(os.getenv("GEMINI_API_KEY")),
        "swagger_docs": "/docs",
        "redoc_docs": "/redoc"
    }

@app.post("/analyze-compass", tags=["Compass AI Analytics"])
def analyze_compass(payload: StudentPayload):
    """
    Menjalankan pipeline analisis ORBIDU Compass AI:
    1. Perhitungan matematis NumPy (Confidence Score, Konsistensi Rapor, Alignment %).
    2. Prompting Gemini 2.0 Flash LLM untuk ringkasan naratif, rekomendasi jurusan, PTN, dan jalur karir.
    """
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
