CREATE TYPE "ActivityType" AS ENUM ('WORDLE', 'WORD_SEARCH');

CREATE TABLE "Word" (
  "id" SERIAL NOT NULL,
  "english" VARCHAR(60) NOT NULL,
  "hint" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Phoneme" (
  "id" SERIAL NOT NULL,
  "symbol" VARCHAR(20) NOT NULL,
  CONSTRAINT "Phoneme_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WordPhoneme" (
  "wordId" INTEGER NOT NULL,
  "phonemeId" INTEGER NOT NULL,
  "position" INTEGER NOT NULL,
  CONSTRAINT "WordPhoneme_pkey" PRIMARY KEY ("wordId", "position")
);

CREATE TABLE "Activity" (
  "id" SERIAL NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "type" "ActivityType" NOT NULL,
  "difficulty" VARCHAR(30) NOT NULL DEFAULT 'standard',
  "maxGuesses" INTEGER NOT NULL DEFAULT 6,
  "showHints" BOOLEAN NOT NULL DEFAULT true,
  "gridSize" INTEGER NOT NULL DEFAULT 8,
  "outputTitle" VARCHAR(120) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ActivityWord" (
  "activityId" INTEGER NOT NULL,
  "wordId" INTEGER NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ActivityWord_pkey" PRIMARY KEY ("activityId", "wordId")
);

CREATE UNIQUE INDEX "Word_english_key" ON "Word"("english");
CREATE UNIQUE INDEX "Phoneme_symbol_key" ON "Phoneme"("symbol");
CREATE INDEX "WordPhoneme_phonemeId_idx" ON "WordPhoneme"("phonemeId");
CREATE INDEX "ActivityWord_wordId_idx" ON "ActivityWord"("wordId");

ALTER TABLE "WordPhoneme" ADD CONSTRAINT "WordPhoneme_wordId_fkey"
  FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WordPhoneme" ADD CONSTRAINT "WordPhoneme_phonemeId_fkey"
  FOREIGN KEY ("phonemeId") REFERENCES "Phoneme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ActivityWord" ADD CONSTRAINT "ActivityWord_activityId_fkey"
  FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ActivityWord" ADD CONSTRAINT "ActivityWord_wordId_fkey"
  FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
