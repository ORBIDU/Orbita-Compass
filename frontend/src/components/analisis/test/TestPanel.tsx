import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/navigation";
import { ANALYZING } from "@/content/analisis";
import { useAuth } from "@/context/AuthContext";
import type { AsyncState } from "@/lib/useAsync";
import { analyzeCompass } from "@/services/compassService";
import { submitAssessment } from "@/services/assessmentService";
import { ApiError } from "@/services/http";
import type { AsesmenAnswers, AsesmenDoc, AsesmenDraft, AssessmentSummary } from "@/types/analisis";
import type { BidangKey } from "@/types/jurusan";
import type { StudentStatus } from "@/types/student";
import { PanelError, PanelSkeleton } from "../PanelState";
import AnalyzingView from "./AnalyzingView";
import TestDone from "./TestDone";
import TestForm from "./TestForm";

/** Lama minimum layar "AI sedang memahami profilmu" dan jeda antarlangkah. */
const MIN_ANALYZE_MS = 2600;
const STEP_MS = 900;

interface TestPanelProps {
  doc: AsesmenDoc;
  userId: string;
  status: StudentStatus;
  draft: AsyncState<AsesmenDraft | null>;
  summary: AsyncState<AssessmentSummary | null>;
  latestBidang: BidangKey | null;
  onProgress: (sectionsDone: number) => void;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Tab Gambaran Minat Bakat: tes, layar analisis, atau ringkasan setelah selesai. */
export default function TestPanel({ doc, userId, status, draft, summary, latestBidang, onProgress }: TestPanelProps) {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // Jawaban yang sedang dianalisis; dipakai lagi jika siswa kembali ke tes setelah gagal.
  const [pending, setPending] = useState<AsesmenAnswers | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  async function analyze(answers: AsesmenAnswers) {
    setPending(answers);
    setAnalyzing(true);
    setError(null);
    setStep(0);
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [window.setTimeout(() => setStep((s) => Math.max(s, 1)), STEP_MS), window.setTimeout(() => setStep((s) => Math.max(s, 2)), STEP_MS * 2)];
    const started = Date.now();
    try {
      await submitAssessment(userId, answers);
      await analyzeCompass();
      await sleep(Math.max(0, MIN_ANALYZE_MS - (Date.now() - started)));
      setStep(3);
      // Ambil ulang data akun supaya status siswa berubah menjadi "sudah_asesmen".
      await refreshUser();
      navigate(ROUTES.compass);
    } catch (err) {
      timers.current.forEach((t) => window.clearTimeout(t));
      setError(err instanceof ApiError && err.isNetworkError ? err.message : ANALYZING.error);
    }
  }

  if (analyzing) {
    return (
      <AnalyzingView
        step={step}
        error={error}
        onRetry={() => pending && void analyze(pending)}
        onBack={() => {
          setAnalyzing(false);
          setError(null);
        }}
      />
    );
  }

  if (status !== "baru") {
    if (summary.loading) return <PanelSkeleton />;
    if (summary.error) return <PanelError onRetry={summary.reload} />;
    if (summary.data) return <TestDone doc={doc} summary={summary.data} latestBidang={latestBidang} />;
  }

  if (draft.loading) return <PanelSkeleton />;
  if (draft.error) return <PanelError onRetry={draft.reload} />;
  const initial: AsesmenDraft | null = pending
    ? { answers: pending, sectionIndex: doc.sections.length - 1, savedAt: draft.data?.savedAt ?? null }
    : (draft.data ?? null);
  return <TestForm doc={doc} userId={userId} initialDraft={initial} onProgress={onProgress} onAnalyze={analyze} />;
}
