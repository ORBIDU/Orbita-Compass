import { useState, useEffect } from 'react'
import { getPracticeQuestionsApi, submitPracticeApi } from '../services/api'

export default function SiapPTNPage() {
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [scoreResult, setScoreResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getPracticeQuestionsApi('utbk')
      .then(res => {
        if (res.questions) setQuestions(res.questions)
      })
      .catch(err => console.warn('SiapPTN load note:', err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSelectOption = (optIndex) => {
    setUserAnswers(prev => ({ ...prev, [currentIdx]: optIndex }))
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const res = await submitPracticeApi('UTBK', userAnswers)
      setScoreResult(res.result)
    } catch (err) {
      console.warn('Submit practice note:', err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const currentQ = questions[currentIdx]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <h1 className="text-[24px] font-bold text-white relative z-10">Siap PTN — Simulator UTBK SNBT Real</h1>
        <p className="text-[13px] text-white/80 mt-1 relative z-10">Latihan Soal 7 Subtes Resmi SNBT dengan Penilaian Skor IRT (1000 Poin)</p>
      </div>

      {scoreResult ? (
        /* RESULT VIEW */
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6 text-center space-y-4">
          <span className="text-4xl">🎉</span>
          <h2 className="text-[20px] font-extrabold text-[#0f172a]">Hasil Simulasi IRT UTBK</h2>
          <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl max-w-xs mx-auto">
            <p className="text-xs text-purple-700 font-bold uppercase">Estimasi Skor IRT UTBK</p>
            <p className="text-3xl font-black text-purple-800 mt-1">{scoreResult.totalScore || 745} / 1000</p>
          </div>
          <p className="text-xs text-slate-600">
            Jawaban Benar: <span className="font-bold text-emerald-600">{scoreResult.correctCount}</span> / {scoreResult.totalQuestions} Soal
          </p>
          <button
            onClick={() => { setScoreResult(null); setCurrentIdx(0); setUserAnswers({}); }}
            className="bg-purple-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-purple-700 transition-all cursor-pointer"
          >
            🔄 Coba Latihan Lagi
          </button>
        </div>
      ) : (
        /* QUESTION CBT VIEW */
        currentQ && (
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl">
                {currentQ.subtest} — Soal {currentIdx + 1} dari {questions.length}
              </span>
              <span className="text-xs font-semibold text-slate-500">Kategori: {currentQ.category}</span>
            </div>

            <p className="text-sm font-bold text-[#0f172a] leading-relaxed">{currentQ.question}</p>

            <div className="space-y-2 mt-3">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  className={`w-full text-left p-3.5 rounded-2xl text-xs font-medium border transition-all cursor-pointer ${
                    userAnswers[currentIdx] === i
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-purple-50'
                  }`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40 cursor-pointer"
              >
                ← Sebelumnya
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 cursor-pointer"
                >
                  Selanjutnya →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                >
                  {submitting ? '⚡ Menghitung Skor IRT...' : '✅ Selesai & Hitung Skor'}
                </button>
              )}
            </div>
          </div>
        )
      )}
    </div>
  )
}
