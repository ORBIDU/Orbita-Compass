import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { prisma } from '../config/prisma';

export interface GenerateQuestionOptions {
  category: string; // 'snbt' | 'skd' | 'tka' | 'utbk'
  subtest?: string;
  topic?: string;
  count?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  saveToBank?: boolean;
}

export interface GeneratedQuestionItem {
  id?: string;
  category: string;
  subtest: string;
  topic: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  difficultyWeight: number;
  source: string;
}

export interface BlueprintTaxonomyItem {
  category: string;
  subtest: string;
  description: string;
  totalAvailable: number;
  guidelines: {
    tone: string;
    optionsCount: number;
    hasPassage: boolean;
    difficultyDistribution: string;
  };
}

let cachedBlueprints: Record<string, any> | null = null;
let cachedMasterQuestions: any[] | null = null;

function loadBlueprints(): Record<string, any> {
  if (cachedBlueprints) return cachedBlueprints;
  const blueprintPath = path.resolve(__dirname, '../../prisma/data/question_blueprints.json');
  if (fs.existsSync(blueprintPath)) {
    try {
      cachedBlueprints = JSON.parse(fs.readFileSync(blueprintPath, 'utf-8'));
      return cachedBlueprints || {};
    } catch (e) {
      console.error('Failed to parse question_blueprints.json:', e);
    }
  }
  return {};
}

function loadMasterQuestions(): any[] {
  if (cachedMasterQuestions) return cachedMasterQuestions;
  const masterPath = path.resolve(__dirname, '../../prisma/data/master_questions.json');
  if (fs.existsSync(masterPath)) {
    try {
      cachedMasterQuestions = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));
      return cachedMasterQuestions || [];
    } catch (e) {
      console.error('Failed to parse master_questions.json:', e);
    }
  }
  return [];
}

/**
 * Returns the structured taxonomy of available exam categories & subtests
 * learned from the question bank.
 */
export function getBlueprintTaxonomy(): BlueprintTaxonomyItem[] {
  const blueprints = loadBlueprints();
  return Object.entries(blueprints).map(([_, bp]) => ({
    category: bp.category,
    subtest: bp.subtest,
    description: bp.description,
    totalAvailable: bp.total_available,
    guidelines: bp.generation_guidelines
  }));
}

/**
 * Retrieves few-shot exemplars for a given category & subtest
 */
export function getBlueprintExemplars(category: string, subtest?: string): any[] {
  const blueprints = loadBlueprints();
  const cat = category.toLowerCase() === 'utbk' ? 'snbt' : category.toLowerCase();

  // Find exact match or first matching category
  for (const [key, bp] of Object.entries(blueprints)) {
    if (bp.category === cat) {
      if (!subtest || bp.subtest.toLowerCase().includes(subtest.toLowerCase())) {
        return bp.exemplars || [];
      }
    }
  }
  return [];
}

/**
 * Generates exam questions using Gemini AI powered by few-shot learning
 * from genuine Indonesian UTBK, SKD, and TKA question archives.
 */
export async function generateQuestions(options: GenerateQuestionOptions): Promise<{
  success: boolean;
  category: string;
  subtest: string;
  totalGenerated: number;
  source: 'gemini-ai' | 'blueprint-synthesis' | 'archive-exemplar';
  questions: GeneratedQuestionItem[];
}> {
  const rawCat = options.category.toLowerCase();
  const category = rawCat === 'utbk' ? 'snbt' : rawCat;
  const count = Math.min(10, Math.max(1, options.count || 5));
  const difficulty = options.difficulty || 'medium';

  const blueprints = loadBlueprints();

  // Select target blueprint
  let targetBlueprintKey = '';
  for (const [key, bp] of Object.entries(blueprints)) {
    if (bp.category === category) {
      if (!options.subtest || bp.subtest.toLowerCase().includes(options.subtest.toLowerCase())) {
        targetBlueprintKey = key;
        break;
      }
    }
  }

  // Fallback to first available in category
  if (!targetBlueprintKey) {
    const firstCatKey = Object.keys(blueprints).find(k => k.startsWith(`${category}:`));
    targetBlueprintKey = firstCatKey || Object.keys(blueprints)[0];
  }

  const bp = blueprints[targetBlueprintKey] || {
    category,
    subtest: options.subtest || 'Umum',
    description: 'Ujian Standar Nasional',
    exemplars: [],
    generation_guidelines: { tone: 'Formal akademis', options_count: 5, has_passage: false }
  };

  const targetSubtest = bp.subtest;
  const targetTopic = options.topic || `Materi Standar ${targetSubtest}`;
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const generated = await callGeminiGenerate({
        category,
        subtest: targetSubtest,
        topic: targetTopic,
        count,
        difficulty,
        exemplars: bp.exemplars || [],
        guidelines: bp.generation_guidelines,
        apiKey
      });

      if (generated && generated.length > 0) {
        if (options.saveToBank) {
          await saveQuestionsToBank(generated);
        }
        return {
          success: true,
          category,
          subtest: targetSubtest,
          totalGenerated: generated.length,
          source: 'gemini-ai',
          questions: generated
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to blueprint synthesis:', err);
    }
  }

  // High-fidelity fallback synthesis from the 1,051 master questions archive
  const fallbackQuestions = synthesizeFromArchive(category, targetSubtest, targetTopic, count, difficulty);

  if (options.saveToBank && fallbackQuestions.length > 0) {
    await saveQuestionsToBank(fallbackQuestions);
  }

  return {
    success: true,
    category,
    subtest: targetSubtest,
    totalGenerated: fallbackQuestions.length,
    source: apiKey ? 'blueprint-synthesis' : 'archive-exemplar',
    questions: fallbackQuestions
  };
}

async function callGeminiGenerate(params: {
  category: string;
  subtest: string;
  topic: string;
  count: number;
  difficulty: string;
  exemplars: any[];
  guidelines: any;
  apiKey: string;
}): Promise<GeneratedQuestionItem[]> {
  const { category, subtest, topic, count, difficulty, exemplars, apiKey } = params;

  const prompt = `Anda adalah Tim Ahli Pembuat Soal Ujian Nasional Indonesia (BPPP Kemdikbud, Balai Pengelolaan Pengujian Pendidikan untuk SNBT/UTBK, dan BKN untuk SKD Kedinasan).
Tugas Anda adalah membuat ${count} butir soal pilihan ganda BARU, ASLI, dan BERKUALITAS TINGGI sesuai standar resmi.

Spesifikasi:
- Kategori Ujian: ${category.toUpperCase()}
- Subtes: ${subtest}
- Topik / Materi: ${topic}
- Tingkat Kesulitan: ${difficulty.toUpperCase()} (HOTS - Higher Order Thinking Skills)
- Format Opsi: Tepat 5 pilihan jawaban (A, B, C, D, E)
- Kunci Jawaban: answerIndex (0 untuk A, 1 untuk B, 2 untuk C, 3 untuk D, 4 untuk E)
- Pembahasan: Berikan penjelasan konseptual dan alasan mengapa opsi yang dipilih benar serta mengapa opsi lainnya salah.

Berikut adalah CONTOH SOAL RESMI SEBAGAI BLUEPRINT / ACUAN GAYA & KUALITAS BAHASA:
${JSON.stringify(exemplars.slice(0, 2), null, 2)}

INSTRUKSI PENTING:
- Hasilkan output dalam format JSON murni.
- Jangan gunakan markdown code blocks jika schema JSON sudah ditentukan.
- Setiap soal harus relevan dengan kurikulum dan standar seleksi perguruan tinggi/kedinasan Indonesia.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: 'application/json',
      response_schema: {
        type: 'OBJECT',
        properties: {
          questions: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                question: { type: 'STRING' },
                options: { type: 'ARRAY', items: { type: 'STRING' } },
                answerIndex: { type: 'INTEGER' },
                explanation: { type: 'STRING' },
                difficultyWeight: { type: 'NUMBER' },
                topic: { type: 'STRING' }
              },
              required: ['question', 'options', 'answerIndex', 'explanation']
            }
          }
        },
        required: ['questions']
      },
      temperature: 0.7
    }
  };

  const response = await axios.post(url, requestBody, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 25000
  });

  const contentText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!contentText) return [];

  const parsed = JSON.parse(contentText);
  const items = parsed.questions || [];

  return items.map((q: any) => ({
    category,
    subtest,
    topic: q.topic || topic,
    question: q.question,
    options: Array.isArray(q.options) ? q.options : [],
    answerIndex: typeof q.answerIndex === 'number' ? q.answerIndex : 0,
    explanation: q.explanation || 'Pembahasan soal.',
    difficultyWeight: q.difficultyWeight || (difficulty === 'hard' ? 1.3 : difficulty === 'easy' ? 0.9 : 1.0),
    source: `Orbita AI (${subtest})`
  }));
}

function synthesizeFromArchive(
  category: string,
  subtest: string,
  topic: string,
  count: number,
  difficulty: string
): GeneratedQuestionItem[] {
  const master = loadMasterQuestions();
  const matched = master.filter(
    q => q.category === category && (!subtest || q.subtest.toLowerCase().includes(subtest.toLowerCase()))
  );

  const pool = matched.length > 0 ? matched : master.filter(q => q.category === category);
  const sourcePool = pool.length > 0 ? pool : master;

  // Shuffle and pick `count` items
  const shuffled = [...sourcePool].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  return selected.map(q => ({
    category: q.category,
    subtest: q.subtest,
    topic: q.topic || topic,
    question: q.question,
    options: q.options,
    answerIndex: q.answerIndex,
    explanation: q.explanation,
    difficultyWeight: q.difficultyWeight || (difficulty === 'hard' ? 1.25 : 1.0),
    source: q.source || 'Arsip Soal Orbita Standar Nasional'
  }));
}

async function saveQuestionsToBank(questions: GeneratedQuestionItem[]) {
  try {
    const data = questions.map(q => ({
      category: q.category,
      subtest: q.subtest,
      topic: q.topic,
      question: q.question,
      optionsJson: JSON.stringify(q.options),
      answerIndex: q.answerIndex,
      explanation: q.explanation,
      source: q.source,
      difficultyWeight: q.difficultyWeight
    }));

    await prisma.questionBank.createMany({
      data
    });
  } catch (err) {
    console.error('Failed to save questions to QuestionBank:', err);
  }
}
