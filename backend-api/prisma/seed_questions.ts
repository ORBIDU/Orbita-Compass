import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function seedQuestionBank() {
  console.log('📚 Starting QuestionBank Seeding from Master Questions Archive...');

  const dataPath = path.resolve(__dirname, 'data/master_questions.json');
  if (!fs.existsSync(dataPath)) {
    console.error(`File not found: ${dataPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const questions: any[] = JSON.parse(rawData);

  console.log(`Loaded ${questions.length} questions from ${dataPath}`);

  // Batch insert in chunks of 100
  const CHUNK_SIZE = 100;
  let totalInserted = 0;

  for (let i = 0; i < questions.length; i += CHUNK_SIZE) {
    const chunk = questions.slice(i, i + CHUNK_SIZE);
    const data = chunk.map((q) => ({
      category: q.category.toLowerCase(),
      subtest: q.subtest,
      topic: q.topic || `Materi ${q.subtest}`,
      question: q.question,
      optionsJson: JSON.stringify(q.options),
      answerIndex: q.answerIndex,
      explanation: q.explanation || null,
      source: q.source || null,
      difficultyWeight: q.difficultyWeight || 1.0,
    }));

    await prisma.questionBank.createMany({
      data,
    });

    totalInserted += data.length;
    console.log(`  -> Inserted chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(questions.length / CHUNK_SIZE)} (${totalInserted}/${questions.length})`);
  }

  const totalInDb = await prisma.questionBank.count();
  console.log(`\n✅ Seeding Complete! Total questions in QuestionBank: ${totalInDb}`);
}

seedQuestionBank()
  .catch((e) => {
    console.error('Error during QuestionBank seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
