import numpy as np
from typing import List, Dict, Any, Tuple

def calculate_scoring_metrics(
    academic_records: List[Dict[str, Any]],
    achievements: List[Dict[str, Any]],
    assessment: Dict[str, float],
    target_major: str
) -> Tuple[float, float, float, str, List[str]]:
    """
    Calculates mathematical metrics for student profiling across ALL major tracks:
    1. Competency Radar Score (Academic consistency & subject weighting)
    2. Interest Alignment Percentage (Domain-weighted assessment matching)
    3. Confidence Index (w1 * RaporConsistency + w2 * AssessmentMatch + w3 * AchievementWeight)
    4. Alignment Status (ALIGNED / PARTIAL / MISALIGNED)
    5. Top Strengths list
    """
    safe_target = (target_major or "").lower()

    # 1. Academic Competency Score
    if academic_records:
        scores = [float(r.get("score") or 75.0) for r in academic_records if isinstance(r, dict)]
        if not scores:
            scores = [75.0]
        avg_score = float(np.mean(scores))
        std_dev = float(np.std(scores)) if len(scores) > 1 else 0.0
        # Rapor consistency decreases with higher standard deviation
        rapor_consistency = max(0.0, min(100.0, avg_score - (std_dev * 0.5)))
    else:
        avg_score = 75.0
        rapor_consistency = 70.0

    # 2. Interest Assessment Alignment
    tech_score = float(assessment.get("technology") or 70.0)
    research_score = float(assessment.get("research") or 70.0)
    creativity_score = float(assessment.get("creativity") or 70.0)
    leadership_score = float(assessment.get("leadership") or 70.0)
    comm_score = float(assessment.get("communication") or 70.0)

    avg_assessment = float(np.mean([tech_score, research_score, creativity_score, leadership_score, comm_score]))

    # Multi-Domain Keyword Match
    if any(kw in safe_target for kw in ["informatika", "komputer", "sistem informasi", "teknik elektro", "data science", "software", "ai"]):
        assessment_match = (tech_score * 0.4 + research_score * 0.3 + avg_assessment * 0.3)
    elif any(kw in safe_target for kw in ["kedokteran", "farmasi", "kesehatan", "biologi", "keperawatan", "gizi"]):
        assessment_match = (research_score * 0.4 + tech_score * 0.2 + avg_assessment * 0.4)
    elif any(kw in safe_target for kw in ["manajemen", "bisnis", "akuntansi", "ekonomi", "keuangan"]):
        assessment_match = (leadership_score * 0.4 + comm_score * 0.3 + avg_assessment * 0.3)
    elif any(kw in safe_target for kw in ["hukum", "ilmu politik", "hubungan internasional", "komunikasi", "sosiologi"]):
        assessment_match = (comm_score * 0.4 + leadership_score * 0.3 + avg_assessment * 0.3)
    elif any(kw in safe_target for kw in ["desain", "dkv", "seni", "arsitektur", "media"]):
        assessment_match = (creativity_score * 0.5 + comm_score * 0.2 + avg_assessment * 0.3)
    elif any(kw in safe_target for kw in ["psikologi"]):
        assessment_match = (comm_score * 0.35 + research_score * 0.35 + avg_assessment * 0.3)
    else:
        assessment_match = avg_assessment

    # 3. Achievement Weight Bonus
    achievement_weight = min(20.0, len(achievements) * 5.0)

    # 4. Confidence Index Formula
    # Confidence = 0.45 * RaporConsistency + 0.35 * AssessmentMatch + 0.20 * (AchievementWeight * 5)
    confidence_score = round(0.45 * rapor_consistency + 0.35 * assessment_match + 0.20 * (achievement_weight * 5), 1)
    confidence_score = min(100.0, max(40.0, confidence_score))

    interest_alignment_pct = round(assessment_match, 1)
    competency_alignment_pct = round(avg_score, 1)

    # 5. Determine Alignment Status
    if confidence_score >= 80 and interest_alignment_pct >= 75:
        alignment_status = "ALIGNED"
    elif confidence_score >= 65:
        alignment_status = "PARTIAL"
    else:
        alignment_status = "MISALIGNED"

    # Identify Strengths
    strengths = []
    if tech_score >= 80:
        strengths.append("Teknologi & Algoritma")
    if research_score >= 80:
        strengths.append("Riset & Analisis Data")
    if creativity_score >= 80:
        strengths.append("Kreativitas & Desain")
    if leadership_score >= 80:
        strengths.append("Kepemimpinan & Manajemen")
    if comm_score >= 80:
        strengths.append("Komunikasi Publik & Negosiasi")
    if avg_score >= 85:
        strengths.append("Konsistensi Nilai Rapor Tinggi")

    if not strengths:
        strengths = ["Problem Solving Dasar", "Semangat Belajar Tinggi"]

    return confidence_score, interest_alignment_pct, competency_alignment_pct, alignment_status, strengths
