import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultWords = [
  { english: "thin", phonemes: ["θ", "ɪ", "n"], hint: "TH (as in thin)" },
  { english: "ship", phonemes: ["ʃ", "ɪ", "p"], hint: "SH (as in ship)" },
  { english: "train", phonemes: ["t", "ɹ", "æɪ", "n"], hint: "AY (as in train)" },
  { english: "stamp", phonemes: ["s", "t", "æ", "m", "p"], hint: "A (as in hat)" },
  { english: "frog", phonemes: ["f", "ɹ", "ɔ", "ɡ"], hint: "FROG" },
];

async function seedWord(input) {
  const word = await prisma.word.upsert({
    where: { english: input.english },
    update: { hint: input.hint },
    create: { english: input.english, hint: input.hint },
  });

  await prisma.wordPhoneme.deleteMany({ where: { wordId: word.id } });

  for (let position = 0; position < input.phonemes.length; position++) {
    const phoneme = await prisma.phoneme.upsert({
      where: { symbol: input.phonemes[position] },
      update: {},
      create: { symbol: input.phonemes[position] },
    });

    await prisma.wordPhoneme.create({
      data: { wordId: word.id, phonemeId: phoneme.id, position },
    });
  }

  return word;
}

async function main() {
  const count = await prisma.word.count();
  if (count > 0) return;

  const words = [];
  for (const item of defaultWords) words.push(await seedWord(item));

  const wordle = await prisma.activity.create({
    data: {
      name: "Default Wordle",
      type: "WORDLE",
      difficulty: "standard",
      maxGuesses: 6,
      showHints: true,
      gridSize: 8,
      outputTitle: "Phoneme Wordle",
    },
  });

  const search = await prisma.activity.create({
    data: {
      name: "Default Word Search",
      type: "WORD_SEARCH",
      difficulty: "standard",
      maxGuesses: 6,
      showHints: true,
      gridSize: 8,
      outputTitle: "Phoneme Word Search",
    },
  });

  await prisma.activityWord.createMany({
    data: words.slice(0, 4).map((word, position) => ({
      activityId: wordle.id,
      wordId: word.id,
      position,
    })),
  });

  await prisma.activityWord.createMany({
    data: words.map((word, position) => ({
      activityId: search.id,
      wordId: word.id,
      position,
    })),
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
