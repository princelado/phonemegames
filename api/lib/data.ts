import type { Prisma, PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { ActivityInput, ActivityType, WordInput } from "@/lib/types";

type DbClient = PrismaClient | Prisma.TransactionClient;

const wordInclude = {
  phonemes: {
    orderBy: { position: "asc" as const },
    include: { phoneme: true },
  },
} satisfies Prisma.WordInclude;

const activityInclude = {
  words: {
    orderBy: { position: "asc" as const },
    include: {
      word: { include: wordInclude },
    },
  },
} satisfies Prisma.ActivityInclude;

function toWord(record: Prisma.WordGetPayload<{ include: typeof wordInclude }>) {
  return {
    id: record.id,
    english: record.english,
    hint: record.hint,
    phonemes: record.phonemes.map((item) => item.phoneme.symbol),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function toActivity(record: Prisma.ActivityGetPayload<{ include: typeof activityInclude }>) {
  const words = record.words.map((item) => toWord(item.word));

  return {
    id: record.id,
    name: record.name,
    type: record.type,
    difficulty: record.difficulty,
    maxGuesses: record.maxGuesses,
    showHints: record.showHints,
    gridSize: record.gridSize,
    outputTitle: record.outputTitle,
    wordIds: words.map((word) => word.id),
    words,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

async function attachPhonemes(db: DbClient, wordId: number, symbols: string[]) {
  for (let position = 0; position < symbols.length; position++) {
    const phoneme = await db.phoneme.upsert({
      where: { symbol: symbols[position] },
      update: {},
      create: { symbol: symbols[position] },
    });

    await db.wordPhoneme.create({
      data: {
        wordId,
        phonemeId: phoneme.id,
        position,
      },
    });
  }
}

async function ensureWordsExist(db: DbClient, wordIds: number[]) {
  const count = await db.word.count({ where: { id: { in: wordIds } } });
  if (count !== wordIds.length) {
    throw new Error("One or more selected words do not exist.");
  }
}

export async function listWords() {
  const records = await prisma.word.findMany({
    orderBy: { english: "asc" },
    include: wordInclude,
  });
  return records.map(toWord);
}

export async function getWord(id: number) {
  const record = await prisma.word.findUnique({ where: { id }, include: wordInclude });
  return record ? toWord(record) : null;
}

export async function createWord(input: WordInput) {
  return prisma.$transaction(async (tx) => {
    const word = await tx.word.create({
      data: { english: input.english, hint: input.hint },
    });
    await attachPhonemes(tx, word.id, input.phonemes);
    const result = await tx.word.findUniqueOrThrow({ where: { id: word.id }, include: wordInclude });
    return toWord(result);
  });
}

export async function updateWord(id: number, input: WordInput) {
  const existing = await prisma.word.findUnique({ where: { id } });
  if (!existing) return null;

  return prisma.$transaction(async (tx) => {
    await tx.word.update({
      where: { id },
      data: { english: input.english, hint: input.hint },
    });
    await tx.wordPhoneme.deleteMany({ where: { wordId: id } });
    await attachPhonemes(tx, id, input.phonemes);
    const result = await tx.word.findUniqueOrThrow({ where: { id }, include: wordInclude });
    return toWord(result);
  });
}

export async function deleteWord(id: number) {
  const result = await prisma.word.deleteMany({ where: { id } });
  return result.count > 0;
}

export async function listActivities(type?: ActivityType) {
  const records = await prisma.activity.findMany({
    where: type ? { type } : undefined,
    orderBy: { id: "asc" },
    include: activityInclude,
  });
  return records.map(toActivity);
}

export async function getActivity(id: number) {
  const record = await prisma.activity.findUnique({ where: { id }, include: activityInclude });
  return record ? toActivity(record) : null;
}

async function attachActivityWords(db: DbClient, activityId: number, wordIds: number[]) {
  await ensureWordsExist(db, wordIds);
  await db.activityWord.createMany({
    data: wordIds.map((wordId, position) => ({ activityId, wordId, position })),
  });
}

export async function createActivity(input: ActivityInput) {
  return prisma.$transaction(async (tx) => {
    const activity = await tx.activity.create({
      data: {
        name: input.name,
        type: input.type,
        difficulty: input.difficulty,
        maxGuesses: input.maxGuesses,
        showHints: input.showHints,
        gridSize: input.gridSize,
        outputTitle: input.outputTitle,
      },
    });
    await attachActivityWords(tx, activity.id, input.wordIds);
    const result = await tx.activity.findUniqueOrThrow({ where: { id: activity.id }, include: activityInclude });
    return toActivity(result);
  });
}

export async function updateActivity(id: number, input: ActivityInput) {
  const existing = await prisma.activity.findUnique({ where: { id } });
  if (!existing) return null;

  return prisma.$transaction(async (tx) => {
    await tx.activity.update({
      where: { id },
      data: {
        name: input.name,
        type: input.type,
        difficulty: input.difficulty,
        maxGuesses: input.maxGuesses,
        showHints: input.showHints,
        gridSize: input.gridSize,
        outputTitle: input.outputTitle,
      },
    });
    await tx.activityWord.deleteMany({ where: { activityId: id } });
    await attachActivityWords(tx, id, input.wordIds);
    const result = await tx.activity.findUniqueOrThrow({ where: { id }, include: activityInclude });
    return toActivity(result);
  });
}

export async function deleteActivity(id: number) {
  const result = await prisma.activity.deleteMany({ where: { id } });
  return result.count > 0;
}

export async function databaseHealth() {
  await prisma.$queryRaw`SELECT 1`;
  return true;
}
