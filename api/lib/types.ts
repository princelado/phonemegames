export type ActivityType = "WORDLE" | "WORD_SEARCH";

export type WordInput = {
  english: string;
  hint: string | null;
  phonemes: string[];
};

export type ActivityInput = {
  name: string;
  type: ActivityType;
  difficulty: string;
  maxGuesses: number;
  showHints: boolean;
  gridSize: number;
  outputTitle: string;
  wordIds: number[];
};
