import type { ActivityInput, ActivityType, WordInput } from "@/lib/types";

export function validateWordPayload(body: unknown) {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be a JSON object." } as const;
  }

  const value = body as Record<string, unknown>;
  const english = typeof value.english === "string" ? value.english.trim().toLowerCase() : "";
  const hint = typeof value.hint === "string" ? value.hint.trim() : null;
  const rawPhonemes = Array.isArray(value.phonemes) ? value.phonemes : [];
  const phonemes = rawPhonemes
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!english) return { error: "English word is required." } as const;
  if (english.length > 60) return { error: "English word must be 60 characters or fewer." } as const;
  if (phonemes.length === 0) return { error: "At least one phoneme is required." } as const;
  if (phonemes.length > 20) return { error: "A word may contain at most 20 phoneme symbols." } as const;
  if (phonemes.some((item) => item.length > 20)) {
    return { error: "Each phoneme must be 20 characters or fewer." } as const;
  }

  const word: WordInput = {
    english,
    hint: hint || null,
    phonemes,
  };

  return { value: word } as const;
}

export function validateActivityPayload(body: unknown) {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be a JSON object." } as const;
  }

  const value = body as Record<string, unknown>;
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const type = value.type === "WORDLE" || value.type === "WORD_SEARCH" ? value.type : null;
  const difficulty = typeof value.difficulty === "string" && value.difficulty.trim()
    ? value.difficulty.trim()
    : "standard";
  const maxGuesses = Number(value.maxGuesses ?? 6);
  const gridSize = Number(value.gridSize ?? 8);
  const showHints = value.showHints !== false;
  const outputTitle = typeof value.outputTitle === "string" && value.outputTitle.trim()
    ? value.outputTitle.trim()
    : name;
  const wordIds = Array.isArray(value.wordIds)
    ? value.wordIds.map(Number).filter((id) => Number.isInteger(id) && id > 0)
    : [];

  if (!name) return { error: "Activity name is required." } as const;
  if (!type) return { error: "Activity type must be WORDLE or WORD_SEARCH." } as const;
  if (!Number.isInteger(maxGuesses) || maxGuesses < 1 || maxGuesses > 12) {
    return { error: "maxGuesses must be an integer between 1 and 12." } as const;
  }
  if (!Number.isInteger(gridSize) || gridSize < 5 || gridSize > 16) {
    return { error: "gridSize must be an integer between 5 and 16." } as const;
  }
  if (wordIds.length === 0) {
    return { error: "Select at least one stored word for the activity." } as const;
  }

  const activity: ActivityInput = {
    name,
    type: type as ActivityType,
    difficulty,
    maxGuesses,
    showHints,
    gridSize,
    outputTitle,
    wordIds: [...new Set(wordIds)],
  };

  return { value: activity } as const;
}
