import os
import json
import re
from typing import Dict, Any, List

def generate_llm_insights(
    student_data: Dict[str, Any],
    confidence_score: float,
    alignment_status: str,
    strengths: List[str]
) -> Dict[str, Any]:
    """
    Generates AI guidance summary, recommended majors, univs, and career roadmap.
    Uses Google Gemini API if GEMINI_API_KEY is available, or adaptive domain engine fallback.
    """
    api_key = os.getenv("GEMINI_API_KEY", "")

    target_ptn = student_data.get("target_ptn") or "Universitas Indonesia"
    target_major = student_data.get("target_major") or "Teknik Informatika"
    major_track = student_data.get("major_track") or "IPA"

    if api_key and api_key != "your_gemini_api_key_here":
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = f"""
            Anda adalah Guru BK & Mentor Akademik AI untuk platform ORBIDU Compass.
            Analisis profil siswa berikut:
            - Jurusan Target: {target_major} di {target_ptn}
            - Rumpun: {major_track}
            - Skor Kepercayaan (Confidence): {confidence_score}%
            - Status Keselarasan: {alignment_status}
            - Keunggulan Utama: {', '.join(strengths)}
            - Refleksi Minat: {student_data.get('reflection', {}).get('interests', [])}
            - Cita-cita Karier: {student_data.get('reflection', {}).get('careerGoals', [])}

            Berikan output JSON valid tanpa tanda markdown:
            {{
              "ai_summary": "Summary 2-3 kalimat mengenai kecocokan profil siswa dengan targetnya.",
              "recommended_majors": [
                {{"name": "{target_major}", "match_pct": {confidence_score}, "rationale": "Alasan kecocokan..."}},
                {{"name": "Jurusan Alternatif 1", "match_pct": {max(50.0, confidence_score - 3)}, "rationale": "Alasan alternatif..."}}
              ],
              "recommended_univs": [
                {{"name": "{target_ptn}", "city": "Indonesia", "accreditation": "Unggul"}},
                {{"name": "Institut Teknologi Bandung", "city": "Bandung", "accreditation": "Unggul"}}
              ],
              "recommended_careers": [
                {{
                  "title": "Nama Profesi Target",
                  "description": "Deskripsi singkat profesi.",
                  "skills_required": ["Skill 1", "Skill 2"],
                  "growth_potential": "Sangat Tinggi"
                }}
              ]
            }}
            """
            response = client.models.generate_content(
                model='gemini-2.0-flash',
                contents=prompt,
            )
            raw_text = response.text.strip()
            
            # Robust JSON extraction using regex
            json_match = re.search(r'\{.*\}', raw_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
        except Exception as e:
            print(f"Gemini API call warning: {e}. Falling back to adaptive rule-based AI engine.")

    # Adaptive Rule-Based Fallback Engine matching target major domain
    safe_target = target_major.lower()
    
    if any(kw in safe_target for kw in ["kedokteran", "farmasi", "kesehatan", "biologi"]):
        alt_majors = ["Farmasi Klinis", "Ilmu Keperawatan", "Biomedik"]
        careers = [
            {"title": "Dokter Spesialis / Peneliti Medis", "description": "Mendiagnosis dan merancang terapi pengobatan inovatif.", "skills_required": ["Pengetahuan Medis", "Analisis Biomedis", "Empati"], "growth_potential": "Sangat Tinggi"},
            {"title": "Farmakolog / Formulator Obat", "description": "Mengembangkan dan menguji formulasi obat baru.", "skills_required": ["Kimia Medisinal", "Riset Laboratorium"], "growth_potential": "Tinggi"}
        ]
    elif any(kw in safe_target for kw in ["manajemen", "bisnis", "akuntansi", "ekonomi"]):
        alt_majors = ["Bisnis Digital", "Akuntansi Keuangan", "Ilmu Ekonomi"]
        careers = [
            {"title": "Business Analyst / Financial Consultant", "description": "Menganalisis strategi pertumbuhan bisnis dan efisiensi finansial.", "skills_required": ["Manajemen Risiko", "Financial Modeling", "Kepemimpinan"], "growth_potential": "Sangat Tinggi"},
            {"title": "Product Manager", "description": "Memimpin pengembangan produk dari ide hingga eksekusi pasar.", "skills_required": ["Manajemen Tim", "Analisis Data", "Komunikasi"], "growth_potential": "Tinggi"}
        ]
    elif any(kw in safe_target for kw in ["hukum", "ilmu politik", "hubungan internasional"]):
        alt_majors = ["Hubungan Internasional", "Ilmu Komunikasi", "Ilmu Pemerintahan"]
        careers = [
            {"title": "Konsultan Hukum / Corporate Lawyer", "description": "Memberikan bimbingan legalitas dan perancangan kontrak bisnis.", "skills_required": ["Analisis Legal", "Negosiasi", "Drafting Kontrak"], "growth_potential": "Tinggi"},
            {"title": "Diplomat / Analis Kebijakan", "description": "Mewakili urusan strategis dan hubungan luar negeri.", "skills_required": ["Diplomasi", "Komunikasi Multibahasa"], "growth_potential": "Tinggi"}
        ]
    else:
        alt_majors = ["Sistem Informasi", "Teknologi Data", "Teknik Elektro"]
        careers = [
            {"title": "AI Engineer & Data Scientist", "description": "Mengembangkan model machine learning dan analisis data cerdas.", "skills_required": ["Python & SQL", "Machine Learning", "Problem Solving"], "growth_potential": "Sangat Tinggi"},
            {"title": "Software Architect", "description": "Merancang sistem aplikasi modern skala enterprise.", "skills_required": ["TypeScript / Node.js", "System Design"], "growth_potential": "Tinggi"}
        ]

    return {
        "ai_summary": f"Siswa memiliki profil yang {alignment_status.lower()} dengan target {target_major} di {target_ptn}. Keunggulan utama di bidang {', '.join(strengths[:2])} memberikan landasan akademis yang kuat.",
        "recommended_majors": [
            {
                "name": target_major,
                "match_pct": confidence_score,
                "rationale": f"Minat yang selaras dan konsistensi kompetensi akademis menjadikan {target_major} sebagai pilihan utama."
            },
            {
                "name": alt_majors[0],
                "match_pct": max(60.0, confidence_score - 4.0),
                "rationale": f"Alternatif strategis yang selaras dengan profil minat dan potensi perkembangan karier."
            },
            {
                "name": alt_majors[1],
                "match_pct": max(55.0, confidence_score - 6.0),
                "rationale": "Pilihan cadangan dengan prospek lapangan kerja yang terus tumbuh."
            }
        ],
        "recommended_univs": [
            {"name": target_ptn, "city": "Indonesia", "accreditation": "Unggul"},
            {"name": "Universitas Gadjah Mada (UGM)", "city": "Yogyakarta", "accreditation": "Unggul"},
            {"name": "Universitas Indonesia (UI)", "city": "Depok", "accreditation": "Unggul"}
        ],
        "recommended_careers": careers
    }
