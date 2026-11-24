import axios from 'axios';

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// --------------------------------------------------------------------------
// 1. MATHEMATICAL SCORING ENGINE (TypeScript Implementation of scoring.py)
// --------------------------------------------------------------------------
export function calculateScoringMetrics(
  academicRecords: any[] = [],
  achievements: any[] = [],
  assessment: Record<string, number> = {},
  targetMajor: string = ''
) {
  const safeTarget = (targetMajor || '').toLowerCase();

  // Academic Competency Score
  let avgScore = 75.0;
  let raporConsistency = 70.0;
  if (academicRecords && academicRecords.length > 0) {
    const scores = academicRecords
      .filter((r) => r && typeof r === 'object')
      .map((r) => Number(r.score) || 75.0);
    if (scores.length > 0) {
      avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const variance = scores.reduce((acc, val) => acc + Math.pow(val - avgScore, 2), 0) / scores.length;
      const stdDev = Math.sqrt(variance);
      raporConsistency = Math.max(0, Math.min(100, avgScore - stdDev * 0.5));
    }
  }

  // Interest Assessment Alignment
  const techScore = Number(assessment.technology) || 70.0;
  const researchScore = Number(assessment.research) || 70.0;
  const creativityScore = Number(assessment.creativity) || 70.0;
  const leadershipScore = Number(assessment.leadership) || 70.0;
  const commScore = Number(assessment.communication) || 70.0;
  const avgAssessment = (techScore + researchScore + creativityScore + leadershipScore + commScore) / 5;

  let assessmentMatch = avgAssessment;
  if (['informatika', 'komputer', 'sistem informasi', 'teknik elektro', 'data science', 'software', 'ai'].some((k) => safeTarget.includes(k))) {
    assessmentMatch = techScore * 0.4 + researchScore * 0.3 + avgAssessment * 0.3;
  } else if (['kedokteran', 'farmasi', 'kesehatan', 'biologi', 'keperawatan', 'gizi'].some((k) => safeTarget.includes(k))) {
    assessmentMatch = researchScore * 0.4 + techScore * 0.2 + avgAssessment * 0.4;
  } else if (['manajemen', 'bisnis', 'akuntansi', 'ekonomi', 'keuangan'].some((k) => safeTarget.includes(k))) {
    assessmentMatch = leadershipScore * 0.4 + commScore * 0.3 + avgAssessment * 0.3;
  } else if (['hukum', 'ilmu politik', 'hubungan internasional', 'komunikasi', 'sosiologi'].some((k) => safeTarget.includes(k))) {
    assessmentMatch = commScore * 0.4 + leadershipScore * 0.3 + avgAssessment * 0.3;
  } else if (['desain', 'dkv', 'seni', 'arsitektur', 'media'].some((k) => safeTarget.includes(k))) {
    assessmentMatch = creativityScore * 0.5 + commScore * 0.2 + avgAssessment * 0.3;
  } else if (['psikologi'].some((k) => safeTarget.includes(k))) {
    assessmentMatch = commScore * 0.35 + researchScore * 0.35 + avgAssessment * 0.3;
  }

  // Achievement Weight
  const achievementWeight = Math.min(20.0, (achievements || []).length * 5.0);

  // Confidence Index Formula
  let confidenceScore = 0.45 * raporConsistency + 0.35 * assessmentMatch + 0.20 * (achievementWeight * 5);
  confidenceScore = Math.min(100.0, Math.max(40.0, Math.round(confidenceScore * 10) / 10));

  const interestAlignmentPct = Math.round(assessmentMatch * 10) / 10;
  const competencyAlignmentPct = Math.round(avgScore * 10) / 10;

  // Alignment Status
  let alignmentStatus = 'MISALIGNED';
  if (confidenceScore >= 80 && interestAlignmentPct >= 75) {
    alignmentStatus = 'ALIGNED';
  } else if (confidenceScore >= 65) {
    alignmentStatus = 'PARTIAL';
  }

  // Identify Strengths
  const strengths: string[] = [];
  if (techScore >= 80) strengths.push('Teknologi & Algoritma');
  if (researchScore >= 80) strengths.push('Riset & Analisis Data');
  if (creativityScore >= 80) strengths.push('Kreativitas & Desain');
  if (leadershipScore >= 80) strengths.push('Kepemimpinan & Manajemen');
  if (commScore >= 80) strengths.push('Komunikasi Publik & Negosiasi');
  if (avgScore >= 85) strengths.push('Konsistensi Nilai Rapor Tinggi');
  if (strengths.length === 0) strengths.push('Problem Solving Dasar', 'Semangat Belajar Tinggi');

  return {
    confidenceScore,
    interestAlignmentPct,
    competencyAlignmentPct,
    alignmentStatus,
    strengths
  };
}

// --------------------------------------------------------------------------
// 2. GEMINI LLM INSIGHTS GENERATOR (Direct REST API + Fallback)
// --------------------------------------------------------------------------
export async function generateGeminiInsights(
  studentPayload: any,
  confidenceScore: number,
  alignmentStatus: string,
  strengths: string[]
) {
  const targetPtn = studentPayload.target_ptn || 'Universitas Indonesia';
  const targetMajor = studentPayload.target_major || 'Teknik Informatika';
  const majorTrack = studentPayload.major_track || 'IPA';
  const apiKey = GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const prompt = `Anda adalah Guru BK & Mentor Akademik AI untuk platform ORBIDU Compass.
Analisis profil siswa berikut:
- Jurusan Target: ${targetMajor} di ${targetPtn}
- Rumpun: ${majorTrack}
- Skor Kepercayaan (Confidence): ${confidenceScore}%
- Status Keselarasan: ${alignmentStatus}
- Keunggulan Utama: ${strengths.join(', ')}

Berikan output JSON valid murni tanpa markdown:
{
  "ai_summary": "Summary 2-3 kalimat mengenai kecocokan profil siswa dengan targetnya.",
  "recommended_majors": [
    {"name": "${targetMajor}", "match_pct": ${confidenceScore}, "rationale": "Alasan kecocokan..."}
  ],
  "recommended_univs": [
    {"name": "${targetPtn}", "city": "Indonesia", "accreditation": "Unggul"}
  ],
  "recommended_careers": [
    {"title": "Nama Profesi Target", "description": "Deskripsi singkat profesi.", "skills_required": ["Skill 1", "Skill 2"], "growth_potential": "Sangat Tinggi"}
  ]
}`;

      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        { timeout: 15000 }
      );

      const rawText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err: any) {
      console.warn('Direct Gemini API call notice:', err.message);
    }
  }

  // Domain-Aware Adaptive Heuristics Fallback
  const safeTarget = targetMajor.toLowerCase();
  let altMajors = ['Sistem Informasi', 'Teknologi Data', 'Teknik Elektro'];
  let careers = [
    { title: 'AI Engineer & Data Scientist', description: 'Mengembangkan model machine learning dan analisis data cerdas.', skills_required: ['Python & SQL', 'Machine Learning', 'Problem Solving'], growth_potential: 'Sangat Tinggi' },
    { title: 'Software Architect', description: 'Merancang sistem aplikasi modern skala enterprise.', skills_required: ['TypeScript / Node.js', 'System Design'], growth_potential: 'Tinggi' }
  ];

  if (['kedokteran', 'farmasi', 'kesehatan', 'biologi'].some((k) => safeTarget.includes(k))) {
    altMajors = ['Farmasi Klinis', 'Ilmu Keperawatan', 'Biomedik'];
    careers = [
      { title: 'Dokter Spesialis / Peneliti Medis', description: 'Mendiagnosis dan merancang terapi pengobatan inovatif.', skills_required: ['Pengetahuan Medis', 'Analisis Biomedis', 'Empati'], growth_potential: 'Sangat Tinggi' },
      { title: 'Farmakolog / Formulator Obat', description: 'Mengembangkan dan menguji formulasi obat baru.', skills_required: ['Kimia Medisinal', 'Riset Laboratorium'], growth_potential: 'Tinggi' }
    ];
  } else if (['manajemen', 'bisnis', 'akuntansi', 'ekonomi'].some((k) => safeTarget.includes(k))) {
    altMajors = ['Bisnis Digital', 'Akuntansi Keuangan', 'Ilmu Ekonomi'];
    careers = [
      { title: 'Business Analyst / Financial Consultant', description: 'Menganalisis strategi pertumbuhan bisnis dan efisiensi finansial.', skills_required: ['Manajemen Risiko', 'Financial Modeling', 'Kepemimpinan'], growth_potential: 'Sangat Tinggi' },
      { title: 'Product Manager', description: 'Memimpin pengembangan produk dari ide hingga eksekusi pasar.', skills_required: ['Manajemen Tim', 'Analisis Data', 'Komunikasi'], growth_potential: 'Tinggi' }
    ];
  }

  return {
    ai_summary: `Siswa memiliki profil yang ${alignmentStatus.toLowerCase()} dengan target ${targetMajor} di ${targetPtn}. Keunggulan utama di bidang ${strengths.slice(0, 2).join(' & ')} memberikan landasan akademis yang kuat.`,
    recommended_majors: [
      { name: targetMajor, match_pct: confidenceScore, rationale: `Minat yang selaras dan konsistensi kompetensi akademis menjadikan ${targetMajor} sebagai pilihan utama.` },
      { name: altMajors[0], match_pct: Math.max(60.0, confidenceScore - 4.0), rationale: 'Alternatif strategis yang selaras dengan profil minat dan potensi perkembangan karier.' }
    ],
    recommended_univs: [
      { name: targetPtn, city: 'Indonesia', accreditation: 'Unggul' },
      { name: 'Universitas Indonesia (UI)', city: 'Depok', accreditation: 'Unggul' },
      { name: 'Universitas Gadjah Mada (UGM)', city: 'Yogyakarta', accreditation: 'Unggul' }
    ],
    recommended_careers: careers
  };
}

// --------------------------------------------------------------------------
// 3. MAIN TRIGGER FUNCTION (Hybrid Architecture)
// --------------------------------------------------------------------------
export const triggerAiAnalysis = async (studentPayload: any) => {
  // Try microservice first if URL is explicitly configured
  if (process.env.AI_ENGINE_URL && process.env.AI_ENGINE_URL !== 'http://localhost:8000') {
    try {
      const response = await axios.post(`${AI_ENGINE_URL}/analyze-compass`, studentPayload, {
        timeout: 10000,
      });
      return response.data;
    } catch (error: any) {
      console.warn('AI microservice connection notice, switching to internal engine:', error.message);
    }
  }

  // Execute internal scoring & Gemini intelligence directly
  const { academic_records, achievements, assessment, target_major } = studentPayload;
  const metrics = calculateScoringMetrics(academic_records, achievements, assessment, target_major);
  const insights = await generateGeminiInsights(studentPayload, metrics.confidenceScore, metrics.alignmentStatus, metrics.strengths);

  return {
    status: 'success',
    student_id: studentPayload.student_id,
    confidence_score: metrics.confidenceScore,
    interest_alignment_pct: metrics.interestAlignmentPct,
    competency_alignment_pct: metrics.competencyAlignmentPct,
    career_alignment_status: metrics.alignmentStatus,
    top_strengths: metrics.strengths,
    ai_summary: insights.ai_summary,
    recommended_majors: insights.recommended_majors,
    recommended_univs: insights.recommended_univs,
    recommended_careers: insights.recommended_careers
  };
};
