#!/usr/bin/env python3
"""
Orbita Compass Question Ingestion & Blueprint Extraction Pipeline
Parses ~300MB question archive (SKD, TKA, SNBT) into:
1. master_questions.json: Clean questions for QuestionBank database seeding (>1,000 questions).
2. question_blueprints.json: Few-shot exemplars and taxonomy for Gemini AI question generator.
"""

import os
import sys
import zipfile
import io
import re
import json
import subprocess
import xml.etree.ElementTree as ET
from collections import defaultdict

ZIP_PATH = "/home/naufal/Downloads/CONTOH SOAL ORBIDU-20261030T143502Z-1-001.zip"
OUTPUT_QUESTIONS_PATH = "/home/naufal/Projects/Orbita-Compass/backend-api/prisma/data/master_questions.json"
OUTPUT_BLUEPRINT_PATH = "/home/naufal/Projects/Orbita-Compass/backend-api/prisma/data/question_blueprints.json"


def clean_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"\r\n|\r", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def parse_skd_cat_docx(docx_bytes: bytes) -> list:
    """Parses 110 official CAT SKD questions (TWK, TIU, TKP) from DOCX."""
    try:
        with zipfile.ZipFile(io.BytesIO(docx_bytes)) as dz:
            tree = ET.fromstring(dz.read("word/document.xml"))
            paragraphs = [
                p_text.strip()
                for p in tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p")
                if (p_text := "".join(n.text for n in p.iter() if n.text)).strip()
            ]
    except Exception as e:
        print(f"Error reading SKD docx: {e}")
        return []

    current_sub = "TWK"
    questions = []
    i = 0
    while i < len(paragraphs):
        p = paragraphs[i]
        if p in ["TWK", "TIU", "TKP"]:
            current_sub = p
            i += 1
            continue

        m = re.match(r"^(\d+)\.\s*(.*)", p)
        if m:
            q_text = m.group(2).strip()
            options = []
            jawaban = ""
            pembahasan = ""
            i += 1
            while i < len(paragraphs):
                item = paragraphs[i]
                if item in ["TWK", "TIU", "TKP"] or re.match(r"^\d+\.\s*", item):
                    break
                if re.match(r"^[A-E]\.\s*", item):
                    options.append(re.sub(r"^[A-E]\.\s*", "", item).strip())
                elif item.startswith("Jawaban:"):
                    jawaban = item.replace("Jawaban:", "").strip()
                elif item.startswith("Pembahasan:"):
                    pembahasan = item.replace("Pembahasan:", "").strip()
                else:
                    if not options:
                        q_text += "\n" + item
                    elif pembahasan:
                        pembahasan += "\n" + item
                i += 1

            ans_char = jawaban[:1].upper() if jawaban else "A"
            ans_idx = {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4}.get(ans_char, 0)

            if len(options) >= 4 and q_text:
                questions.append({
                    "category": "skd",
                    "subtest": current_sub,
                    "topic": f"Tes Kemampuan Dasar ({current_sub})",
                    "question": clean_text(q_text),
                    "options": options,
                    "answerIndex": ans_idx,
                    "explanation": clean_text(pembahasan or f"Jawaban yang tepat adalah opsi {ans_char}."),
                    "difficultyWeight": 1.1 if current_sub == "TKP" else 1.0,
                    "source": "CAT SKD Kedinasan BKN"
                })
        else:
            i += 1

    return questions


def parse_tka_docx(docx_bytes: bytes, subject_name: str) -> list:
    """Parses TKA questions from subject DOCX files."""
    try:
        with zipfile.ZipFile(io.BytesIO(docx_bytes)) as dz:
            tree = ET.fromstring(dz.read("word/document.xml"))
            paragraphs = [
                p_text.strip()
                for p in tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p")
                if (p_text := "".join(n.text for n in p.iter() if n.text)).strip()
            ]
    except Exception as e:
        print(f"Error reading TKA docx {subject_name}: {e}")
        return []

    questions = []
    i = 0
    while i < len(paragraphs):
        p = paragraphs[i]
        m = re.match(r"^Soal\s+(\d+)", p, re.IGNORECASE)
        if m:
            i += 1
            q_text = ""
            options = []
            kunci = ""
            while i < len(paragraphs):
                item = paragraphs[i]
                if re.match(r"^Soal\s+\d+", item, re.IGNORECASE):
                    break
                if re.match(r"^[A-E]\.\s*", item):
                    options.append(re.sub(r"^[A-E]\.\s*", "", item).strip())
                elif "Kunci Jawaban:" in item or "Jawaban:" in item:
                    kunci = item
                else:
                    if not options:
                        q_text = (q_text + "\n" + item).strip()
                    elif kunci:
                        kunci += "\n" + item
                i += 1

            ans_match = re.search(r"\(([A-E])\)", kunci)
            if not ans_match:
                ans_match = re.search(r"Jawaban:\s*([A-E])\b", kunci)
            ans_char = ans_match.group(1).upper() if ans_match else "A"
            ans_idx = {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4}.get(ans_char, 0)

            clean_kunci = kunci.replace("Kunci Jawaban:", "").replace("Jawaban:", "").strip()

            if len(options) >= 3 and q_text:
                questions.append({
                    "category": "tka",
                    "subtest": subject_name,
                    "topic": f"TKA {subject_name}",
                    "question": clean_text(q_text),
                    "options": options,
                    "answerIndex": ans_idx,
                    "explanation": clean_text(clean_kunci or f"Jawaban yang benar adalah {ans_char}."),
                    "difficultyWeight": 1.0,
                    "source": f"TKA Standard ({subject_name})"
                })
        else:
            i += 1

    return questions


def parse_utbk_2024_pair(soal_bytes: bytes, pemb_bytes: bytes, subtest_code: str, subtest_full: str) -> list:
    """Extracts genuine UTBK 2024 questions and explanations from PDFs."""
    try:
        s_proc = subprocess.run(["pdftotext", "-", "-"], input=soal_bytes, capture_output=True)
        s_text = s_proc.stdout.decode("utf-8", errors="ignore")

        p_proc = subprocess.run(["pdftotext", "-", "-"], input=pemb_bytes, capture_output=True)
        p_text = p_proc.stdout.decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"Error running pdftotext for {subtest_code}: {e}")
        return []

    # Map explanations by number
    pemb_map = {}
    p_chunks = re.split(r"(?:\n|^)\s*(\d{1,2})\.\s+", "\n" + p_text)
    for k in range(1, len(p_chunks), 2):
        num = int(p_chunks[k])
        body = p_chunks[k + 1] if k + 1 < len(p_chunks) else ""
        pemb_map[num] = body.strip()

    questions = []
    # Match questions starting with \n{num}.
    q_matches = list(re.finditer(r"(?:\n|^)\s*(\d{1,2})\.\s+([\s\S]*?)(?=(?:\n\s*\d{1,2}\.\s+)|\Z)", "\n" + s_text))

    for qm in q_matches:
        num = int(qm.group(1))
        chunk = qm.group(2)

        # Try both option formats: (A)-(E) or A.-E.
        opts_paren = list(re.finditer(r"\(([A-E])\)\s*([\s\S]*?)(?=\([A-E]\)|\Z)", chunk))
        opts_dot = list(re.finditer(r"(?:\n|^)\s*([A-E])\.\s*([\s\S]*?)(?=(?:\n\s*[A-E]\.)|\Z)", chunk))

        opts = opts_paren if len(opts_paren) >= 4 else opts_dot if len(opts_dot) >= 4 else []
        if len(opts) >= 4:
            stem = chunk[:opts[0].start()].strip()
            options = [clean_text(o.group(2)) for o in opts[:5]]

            expl = pemb_map.get(num, "")
            ans_match = re.search(r"(?:Jawaban\s*(?:yang benar|yang tepat|adalah)?\s*[:\s]*\(?([A-E])\)?|pilihan\s*\(?([A-E])\)?|\(([A-E])\)|^([A-E])\.)", expl, re.IGNORECASE)
            ans_char = "A"
            if ans_match:
                ans_char = next((g for g in ans_match.groups() if g), "A").upper()

            ans_idx = {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4}.get(ans_char, 0)

            if len(stem) > 15:
                questions.append({
                    "category": "snbt",
                    "subtest": subtest_full,
                    "topic": f"UTBK {subtest_code}",
                    "question": clean_text(stem),
                    "options": options,
                    "answerIndex": ans_idx,
                    "explanation": clean_text(expl or f"Jawaban yang tepat untuk nomor {num} adalah opsi {ans_char}."),
                    "difficultyWeight": 1.2 if subtest_code in ["PM", "PK"] else 1.0,
                    "source": "UTBK Asli BPPP Kemdikbud 2024"
                })

    return questions


def parse_alternatifa_pair(soal_bytes: bytes, pemb_bytes: bytes, subtest_code: str, subtest_full: str) -> list:
    """Extracts bimbel standard questions from Alternatifa ALTO 001."""
    try:
        s_proc = subprocess.run(["pdftotext", "-", "-"], input=soal_bytes, capture_output=True)
        s_text = s_proc.stdout.decode("utf-8", errors="ignore")

        p_proc = subprocess.run(["pdftotext", "-", "-"], input=pemb_bytes, capture_output=True)
        p_text = p_proc.stdout.decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"Error running pdftotext for Alternatifa {subtest_code}: {e}")
        return []

    # Map explanations and answers from Pembahasan
    pemb_map = {}
    p_matches = list(re.finditer(r"(?:\n|^)\s*(\d{1,2})\.\s*[\u200b\s]*(?:\(([A-E])\)|([A-E])\.)\s*([\s\S]*?)(?=(?:\n\s*\d{1,2}\.\s*[\u200b\s]*(?:\([A-E]\)|[A-E]\.))|\Z)", "\n" + p_text))
    for pm in p_matches:
        num = int(pm.group(1))
        ans_char = (pm.group(2) or pm.group(3)).upper()
        expl_body = pm.group(4).strip()
        pemb_map[num] = (ans_char, expl_body)

    # Parse questions from Soal PDF
    questions = []
    q_matches = list(re.finditer(r"(?:\n|^)\s*(\d{1,2})\.\s*(?:\n|(?=[A-Z]))([\s\S]*?)(?=(?:\n\s*\d{1,2}\.\s*(?:\n|(?=[A-Z])))|\Z)", "\n" + s_text))

    for qm in q_matches:
        num = int(qm.group(1))
        body = qm.group(2)

        # Extract options (A)-(E) or A.-E.
        opts = list(re.finditer(r"(?:\(([A-E])\)|\b([A-E])\.)\s*([\s\S]*?)(?=(?:\([A-E]\)|\b[A-E]\.)|\Z)", body))
        if len(opts) >= 4:
            stem = body[:opts[0].start()].strip()
            options = [clean_text(o.group(3)) for o in opts[:5]]

            ans_char, expl = pemb_map.get(num, ("A", ""))
            ans_idx = {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4}.get(ans_char, 0)

            if len(stem) > 20 and len(options) >= 4:
                questions.append({
                    "category": "snbt",
                    "subtest": subtest_full,
                    "topic": f"SNBT {subtest_code} Standar Bimbel",
                    "question": clean_text(stem),
                    "options": options,
                    "answerIndex": ans_idx,
                    "explanation": clean_text(expl or f"Jawaban yang benar adalah ({ans_char})."),
                    "difficultyWeight": 1.15 if subtest_code in ["PM", "PK"] else 1.0,
                    "source": "Alternatifa Project UTBK-SNBT"
                })

    return questions


def main():
    if not os.path.exists(ZIP_PATH):
        print(f"Error: Zip file not found at {ZIP_PATH}")
        sys.exit(1)

    print(f"Opening archive: {ZIP_PATH}...")
    all_questions = []

    with zipfile.ZipFile(ZIP_PATH, "r") as z:
        # 1. Parse SKD CAT
        print("Parsing SKD CAT questions...")
        skd_docx = "CONTOH SOAL ORBIDU/SKD/SOAL - CAT/SoalCAT_110_TWK_TIU_TKP.docx"
        if skd_docx in z.namelist():
            skd_qs = parse_skd_cat_docx(z.read(skd_docx))
            print(f"  -> Extracted {len(skd_qs)} SKD questions.")
            all_questions.extend(skd_qs)

        # 2. Parse All TKA Subjects
        print("Parsing TKA docx questions...")
        tka_files = [n for n in z.namelist() if n.startswith("CONTOH SOAL ORBIDU/TKA/") and n.endswith(".docx")]
        tka_total = 0
        for tf in tka_files:
            sub = tf.split("/")[2]
            qs = parse_tka_docx(z.read(tf), sub)
            tka_total += len(qs)
            all_questions.extend(qs)
        print(f"  -> Extracted {tka_total} TKA questions across {len(tka_files)} files.")

        # 3. Parse UTBK Asli 2024
        print("Parsing UTBK Asli 2024 PDFs...")
        utbk_subtests = [
            ("Literasi Bahasa Indonesia (LBI)", "LBI", "Literasi Bahasa Indonesia"),
            ("Literasi Bahasa Inggris (LBE)", "LBE", "Literasi Bahasa Inggris"),
            ("Pemahaman Bacaan dan Menulis (PBM)", "PBM", "Pemahaman Bacaan dan Menulis"),
            ("Penalaran Umum (PU)", "PU", "Penalaran Umum"),
            ("Pengetahuan dan Pemahaman Umum (PPU)", "PPU", "Pengetahuan dan Pemahaman Umum"),
        ]

        utbk_total = 0
        for folder, code, full_name in utbk_subtests:
            match_s = [n for n in z.namelist() if f"SNBT/{folder}" in n and "SOAL" in n and n.endswith(".pdf")]
            match_p = [n for n in z.namelist() if f"SNBT/{folder}" in n and "PEMBAHASAN" in n and n.endswith(".pdf")]

            if match_s and match_p:
                qs = parse_utbk_2024_pair(z.read(match_s[0]), z.read(match_p[0]), code, full_name)
                utbk_total += len(qs)
                all_questions.extend(qs)
        print(f"  -> Extracted {utbk_total} genuine UTBK 2024 questions.")

        # 4. Parse Alternatifa Bimbel SNBT
        print("Parsing Alternatifa Bimbel SNBT PDFs...")
        alto_subtests = [
            ("PU", "Penalaran Umum"),
            ("PPU", "Pengetahuan dan Pemahaman Umum"),
            ("PBM", "Pemahaman Bacaan dan Menulis"),
            ("LBI", "Literasi Bahasa Indonesia"),
            ("LBE", "Literasi Bahasa Inggris"),
            ("PK", "Pengetahuan Kuantitatif"),
            ("PM", "Penalaran Matematika"),
        ]
        alto_total = 0
        for code, full_name in alto_subtests:
            s_name = f"CONTOH SOAL ORBIDU/SNBT/SOAL BIMBEL/ALTERNATIFA/[Soal-{code}] ALTO 001.pdf"
            p_name = f"CONTOH SOAL ORBIDU/SNBT/SOAL BIMBEL/ALTERNATIFA/[Pembahasan-{code}] ALTO 001.pdf"
            if s_name in z.namelist() and p_name in z.namelist():
                qs = parse_alternatifa_pair(z.read(s_name), z.read(p_name), code, full_name)
                alto_total += len(qs)
                all_questions.extend(qs)
        print(f"  -> Extracted {alto_total} Alternatifa SNBT questions.")

    print(f"\n=======================================================")
    print(f"Total Extracted Questions: {len(all_questions)}")
    category_counts = defaultdict(int)
    subtest_counts = defaultdict(int)
    for q in all_questions:
        category_counts[q["category"]] += 1
        subtest_counts[f"{q['category'].upper()} - {q['subtest']}"] += 1

    print("\nBreakdown by Category:")
    for cat, count in category_counts.items():
        print(f"  - {cat.upper()}: {count} questions")

    print("\nTop Subtests:")
    for sub, count in sorted(subtest_counts.items(), key=lambda x: x[1], reverse=True)[:15]:
        print(f"  - {sub}: {count} questions")

    # Save to master_questions.json
    os.makedirs(os.path.dirname(OUTPUT_QUESTIONS_PATH), exist_ok=True)
    with open(OUTPUT_QUESTIONS_PATH, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, ensure_ascii=False, indent=2)
    print(f"\nSaved master questions to: {OUTPUT_QUESTIONS_PATH}")

    # Build Question Blueprints for Gemini AI Generator
    print("\nGenerating AI Question Blueprints & Exemplars...")
    blueprints = {}
    grouped_by_subtest = defaultdict(list)
    for q in all_questions:
        grouped_by_subtest[(q["category"], q["subtest"])].append(q)

    # Subtest descriptions & competencies in Indonesian educational standards
    subtest_meta = {
        "TWK": "Tes Wawasan Kebangsaan: Mengukur penguasaan materi Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika, dan Bela Negara.",
        "TIU": "Tes Intelegensi Umum: Mengukur kemampuan verbal (analogi, silogisme), numerik (berhitung, deret angka, soal cerita), dan figural.",
        "TKP": "Tes Karakteristik Pribadi: Mengukur pelayanan publik, jejaring kerja, sosial budaya, TIK, profesionalisme, dan anti-radikalisme.",
        "Penalaran Umum": "Menguji kemampuan berpikir induktif, deduktif, dan kuantitatif dalam menganalisis informasi baru secara kritis dan logis.",
        "Pengetahuan dan Pemahaman Umum": "Menguji kemampuan memahami ide pokok, makna istilah kontekstual, bentuk kata, serta relasi semantik dalam bahasa Indonesia.",
        "Pemahaman Bacaan dan Menulis": "Menguji kelogisan susunan wacana, ejaan (PUEBI/EYD V), tanda baca, konjungsi, dan kalimat efektif.",
        "Literasi Bahasa Indonesia": "Menguji kemampuan menganalisis teks kompleks (fiksi & nonfiksi), menyimpulkan tema, tone penulis, dan argumen tersirat.",
        "Literasi Bahasa Inggris": "Menguji pemahaman teks bahasa Inggris akademis, communicative purpose, main idea, specific details, vocabulary in context, and author's attitude.",
        "Pengetahuan Kuantitatif": "Menguji konsep matematika dasar (aljabar, geometri, aritmatika, statistika) dengan format perhitungan cepat dan pilihan ganda standar.",
        "Penalaran Matematika": "Menguji pemecahan masalah kontekstual dunia nyata menggunakan model matematis, rasio, fungsi, dan kalkulasi logis."
    }

    for (cat, sub), items in grouped_by_subtest.items():
        key = f"{cat}:{sub}"
        # Pick 2-3 clean representative exemplars
        exemplars = [
            {
                "question": ex["question"],
                "options": ex["options"],
                "answerIndex": ex["answerIndex"],
                "explanation": ex["explanation"],
                "source": ex.get("source", "")
            }
            for ex in items[:3]
        ]
        meta_desc = subtest_meta.get(sub, f"Materi evaluasi seleksi untuk subtes {sub} tingkat SMA/SMK.")

        blueprints[key] = {
            "category": cat,
            "subtest": sub,
            "total_available": len(items),
            "description": meta_desc,
            "exemplars": exemplars,
            "generation_guidelines": {
                "tone": "Formal akademis standar seleksi nasional (Kemdikbud BPPP / BKN)",
                "options_count": len(exemplars[0]["options"]) if exemplars and "options" in exemplars[0] else 5,
                "has_passage": len(exemplars[0]["question"]) > 250 if exemplars else False,
                "difficulty_distribution": "30% Easy, 50% Medium, 20% Hard (HOTS)"
            }
        }

    with open(OUTPUT_BLUEPRINT_PATH, "w", encoding="utf-8") as f:
        json.dump(blueprints, f, ensure_ascii=False, indent=2)
    print(f"Saved AI blueprints to: {OUTPUT_BLUEPRINT_PATH}")
    print("Pipeline completed successfully!")


if __name__ == "__main__":
    main()
