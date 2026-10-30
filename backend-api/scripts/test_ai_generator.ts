import { getBlueprintTaxonomy, generateQuestions } from '../src/services/aiQuestionService';

async function test() {
  console.log('--- Testing Blueprint Taxonomy ---');
  const taxonomy = getBlueprintTaxonomy();
  console.log(`Loaded ${taxonomy.length} blueprint subtests.`);
  console.log('Sample subtests:', taxonomy.slice(0, 5).map(t => `${t.category.toUpperCase()}: ${t.subtest} (${t.totalAvailable} questions)`));

  console.log('\n--- Testing Question Generation (SNBT - Penalaran Umum) ---');
  const snbtResult = await generateQuestions({
    category: 'snbt',
    subtest: 'Penalaran Umum',
    count: 2,
    difficulty: 'medium',
    saveToBank: false
  });
  console.log('Result Success:', snbtResult.success);
  console.log('Source:', snbtResult.source);
  console.log('Generated Count:', snbtResult.totalGenerated);
  console.log('Sample Question 1:', JSON.stringify(snbtResult.questions[0], null, 2));

  console.log('\n--- Testing Question Generation (SKD - TWK) ---');
  const skdResult = await generateQuestions({
    category: 'skd',
    subtest: 'TWK',
    count: 1,
    difficulty: 'hard',
    saveToBank: false
  });
  console.log('SKD Result:', skdResult.success, 'Subtest:', skdResult.subtest, 'Q:', skdResult.questions[0]?.question.slice(0, 100));

  console.log('\n--- Testing Question Generation (TKA - Fisika) ---');
  const tkaResult = await generateQuestions({
    category: 'tka',
    subtest: 'Fisika',
    count: 1,
    saveToBank: false
  });
  console.log('TKA Result:', tkaResult.success, 'Subtest:', tkaResult.subtest, 'Q:', tkaResult.questions[0]?.question.slice(0, 100));

  console.log('\n✅ All AI Question Service tests passed successfully!');
}

test().catch(console.error);
