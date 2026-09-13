"use client";

import { useEffect, useMemo, useState } from "react";

type Word = {
  id: number;
  english: string;
  hint: string | null;
  phonemes: string[];
};

type Activity = {
  id: number;
  name: string;
  maxGuesses: number;
  showHints: boolean;
  outputTitle: string;
  words: Word[];
};

const keyboard = [
  "p", "t", "k",
  "b", "d", "ɡ",
  "n", "m", "ŋ",
  "f", "s", "θ", "ʃ",
  "v", "z", "ð", "ʒ",
  "l", "ɹ", "w", "j",
  "h", "tʃ", "dʒ",
  "iː", "ɪ", "e", "eː",
  "æ", "ɐ", "ɐː", "ɜː",
  "ʉː", "ɔ", "oː", "ʊ",
  "æɪ", "ɑe", "oɪ", "əʉ",
  "æɔ", "ɪə", "ə",
];

const hintText: Record<string, string> = {
  θ: "TH (as in thin)",
  ʃ: "SH (as in ship)",
  tʃ: "CH (as in chin)",
  dʒ: "J (as in jam)",
  ð: "TH (as in then)",
  ŋ: "NG (as in ring)",
  ɹ: "R",
  ɪ: "I (as in ship)",
  æ: "A (as in hat)",
  æɪ: "AY (as in train)",
  ɑe: "I (as in bike)",
  oɪ: "OI (as in boil)",
  əʉ: "O (as in boat)",
};

export default function Wordle() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityId, setActivityId] = useState<number | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [submittedGuesses, setSubmittedGuesses] = useState<string[][]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/activities?type=WORDLE", {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data) => {
        const loadedActivities = data.activities ?? [];

        setActivities(loadedActivities);

        if (loadedActivities[0]) {
          setActivityId(loadedActivities[0].id);
          setSelectedWordId(
            loadedActivities[0].words[0]?.id ?? null
          );
        }
      })
      .catch(() => {
        setError("Unable to load stored Wordle activities.");
      });
  }, []);

  const activity = useMemo(
    () =>
      activities.find(
        (item) => item.id === activityId
      ) ?? null,
    [activities, activityId]
  );

  const selectedWord = useMemo(
    () =>
      activity?.words.find(
        (word) => word.id === selectedWordId
      ) ?? activity?.words[0] ?? null,
    [activity, selectedWordId]
  );

  const maxGuesses = activity?.maxGuesses ?? 6;
  const showHints = activity?.showHints ?? true;

  function resetGame(nextWordId?: number) {
    if (nextWordId) {
      setSelectedWordId(nextWordId);
    }

    setCurrentGuess([]);
    setSubmittedGuesses([]);
    setGameWon(false);
  }

  function addPhoneme(phoneme: string) {
    if (
      !selectedWord ||
      gameWon ||
      submittedGuesses.length >= maxGuesses ||
      currentGuess.length >= selectedWord.phonemes.length
    ) {
      return;
    }

    setCurrentGuess([...currentGuess, phoneme]);
  }

  function removePhoneme() {
    setCurrentGuess(currentGuess.slice(0, -1));
  }

  function submitGuess() {
    if (
      !selectedWord ||
      currentGuess.length !== selectedWord.phonemes.length
    ) {
      return;
    }

    const correct =
      currentGuess.join("") ===
      selectedWord.phonemes.join("");

    setSubmittedGuesses([
      ...submittedGuesses,
      currentGuess,
    ]);

    setCurrentGuess([]);

    if (correct) {
      setGameWon(true);
    }
  }

  function getCellStyle(
    phoneme: string,
    index: number
  ) {
    if (!selectedWord) {
      return "";
    }

    if (phoneme === selectedWord.phonemes[index]) {
      return "bg-green-600 text-white";
    }

    if (selectedWord.phonemes.includes(phoneme)) {
      return "bg-yellow-500 text-black";
    }

    return "bg-gray-600 text-white";
  }

  function downloadWordle() {
    if (!selectedWord || !activity) {
      return;
    }

    const hints = Object.fromEntries(
      keyboard.map((symbol) => [
        symbol,
        hintText[symbol] || `/${symbol}/`,
      ])
    );

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${activity.outputTitle}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 20px;
      text-align: center;
    }

    .row {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin: 6px;
    }

    .cell {
      width: 55px;
      height: 55px;
      border: 2px solid #777;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
    }

    .correct {
      background: #16a34a;
      color: white;
    }

    .present {
      background: #eab308;
      color: black;
    }

    .wrong {
      background: #525252;
      color: white;
    }

    .keyboard {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: center;
      margin-top: 25px;
    }

    .key,
    .control {
      padding: 10px;
      border: 1px solid #777;
      background: white;
      border-radius: 5px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>${activity.outputTitle}</h1>

  <p>
    Build your guess using the phoneme keyboard.
  </p>

  <div id="grid"></div>
  <div id="message"></div>
  <div id="keyboard" class="keyboard"></div>

  <p>
    <button class="control" onclick="removePhoneme()">
      Delete
    </button>

    <button class="control" onclick="submitGuess()">
      Enter
    </button>
  </p>

  <script>
    const answer = ${JSON.stringify(selectedWord.phonemes)};
    const englishAnswer = ${JSON.stringify(selectedWord.english)};
    const keyboard = ${JSON.stringify(keyboard)};
    const hints = ${JSON.stringify(hints)};
    const maxGuesses = ${maxGuesses};
    const showHints = ${showHints};

    let currentGuess = [];
    let submittedGuesses = [];
    let gameWon = false;

    const gridElement = document.getElementById("grid");
    const keyboardElement = document.getElementById("keyboard");
    const messageElement = document.getElementById("message");

    keyboard.forEach((phoneme) => {
      const button = document.createElement("button");

      button.textContent = phoneme;
      button.className = "key";

      if (showHints) {
        button.title = hints[phoneme] || "/" + phoneme + "/";
      }

      button.onclick = () => addPhoneme(phoneme);
      keyboardElement.appendChild(button);
    });

    function addPhoneme(phoneme) {
      if (
        gameWon ||
        submittedGuesses.length >= maxGuesses ||
        currentGuess.length >= answer.length
      ) {
        return;
      }

      currentGuess.push(phoneme);
      render();
    }

    function removePhoneme() {
      currentGuess.pop();
      render();
    }

    function submitGuess() {
      if (
        currentGuess.length !== answer.length ||
        gameWon
      ) {
        return;
      }

      submittedGuesses.push([...currentGuess]);

      const correct =
        currentGuess.join("") === answer.join("");

      currentGuess = [];

      if (correct) {
        gameWon = true;
        messageElement.textContent =
          "Correct! English word: " + englishAnswer;
      } else if (
        submittedGuesses.length >= maxGuesses
      ) {
        messageElement.textContent =
          "No guesses remaining. Answer: " + englishAnswer;
      }

      render();
    }

    function getStatus(phoneme, index) {
      if (phoneme === answer[index]) {
        return "correct";
      }

      if (answer.includes(phoneme)) {
        return "present";
      }

      return "wrong";
    }

    function render() {
      gridElement.innerHTML = "";

      submittedGuesses.forEach((guess) => {
        const row = document.createElement("div");
        row.className = "row";

        guess.forEach((phoneme, index) => {
          const cell = document.createElement("div");

          cell.className =
            "cell " + getStatus(phoneme, index);

          cell.textContent = phoneme;
          row.appendChild(cell);
        });

        gridElement.appendChild(row);
      });

      if (
        !gameWon &&
        submittedGuesses.length < maxGuesses
      ) {
        const row = document.createElement("div");
        row.className = "row";

        for (let index = 0; index < answer.length; index++) {
          const cell = document.createElement("div");

          cell.className = "cell";
          cell.textContent = currentGuess[index] || "";
          row.appendChild(cell);
        }

        gridElement.appendChild(row);
      }
    }

    render();
  </script>
</body>
</html>`;

    const blob = new Blob(
      [html],
      { type: "text/html" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "phoneme-wordle.html";
    link.click();

    URL.revokeObjectURL(url);
  }

  if (error) {
    return (
      <main className="p-8">
        <p>{error}</p>
      </main>
    );
  }

  if (!activity || !selectedWord) {
    return (
      <main className="p-8">
        <p>Loading stored Wordle data...</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-3">
          Wordle Builder
        </h1>

        <p className="mb-8">
          Choose a saved activity and word from the database.
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          <section className="border rounded-lg p-6 space-y-5">
            <h2 className="text-2xl font-semibold">
              Activity Settings
            </h2>

            <label className="block">
              Configuration

              <select
                className="block mt-1 border rounded px-3 py-2 w-full bg-transparent"
                value={activity.id}
                onChange={(event) => {
                  const id = Number(event.target.value);
                  const nextActivity =
                    activities.find(
                      (item) => item.id === id
                    );

                  setActivityId(id);
                  resetGame(
                    nextActivity?.words[0]?.id
                  );
                }}
              >
                {activities.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              Choose a word

              <select
                className="block mt-1 border rounded px-3 py-2 w-full bg-transparent"
                value={selectedWord.id}
                onChange={(event) =>
                  resetGame(
                    Number(event.target.value)
                  )
                }
              >
                {activity.words.map((word) => (
                  <option
                    key={word.id}
                    value={word.id}
                  >
                    {word.english}
                  </option>
                ))}
              </select>
            </label>

            <div className="text-sm space-y-1">
              <p>
                <strong>Max guesses:</strong>{" "}
                {maxGuesses}
              </p>

              <p>
                <strong>Hints:</strong>{" "}
                {showHints ? "On" : "Off"}
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                className="border rounded px-4 py-2"
                onClick={() => resetGame()}
              >
                Reset Game
              </button>

              <button
                className="border rounded px-4 py-2"
                onClick={downloadWordle}
              >
                Generate HTML
              </button>
            </div>
          </section>

          <section className="lg:col-span-2 border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Activity Preview
            </h2>

            <div className="space-y-2 mb-3">
              {submittedGuesses.map(
                (guess, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex justify-center gap-2"
                  >
                    {guess.map(
                      (phoneme, index) => (
                        <div
                          key={index}
                          className={`w-14 h-14 border rounded flex items-center justify-center text-xl font-bold ${getCellStyle(
                            phoneme,
                            index
                          )}`}
                        >
                          {phoneme}
                        </div>
                      )
                    )}
                  </div>
                )
              )}
            </div>

            {!gameWon &&
              submittedGuesses.length < maxGuesses && (
                <div className="flex justify-center gap-2 mb-8">
                  {selectedWord.phonemes.map(
                    (_, index) => (
                      <div
                        key={index}
                        className="w-14 h-14 border rounded flex items-center justify-center text-xl font-bold"
                      >
                        {currentGuess[index] || ""}
                      </div>
                    )
                  )}
                </div>
              )}

            {gameWon && (
              <p className="text-center text-xl font-bold mb-5">
                Correct! English word: {selectedWord.english}
              </p>
            )}

            {!gameWon &&
              submittedGuesses.length >= maxGuesses && (
                <p className="text-center font-bold mb-5">
                  No guesses remaining. Answer: {selectedWord.english}
                </p>
              )}

            <div className="flex flex-wrap gap-2 justify-center">
              {keyboard.map((phoneme) => (
                <button
                  key={phoneme}
                  title={
                    showHints
                      ? hintText[phoneme] || `/${phoneme}/`
                      : undefined
                  }
                  className="border rounded px-3 py-2"
                  onClick={() =>
                    addPhoneme(phoneme)
                  }
                >
                  {phoneme}
                </button>
              ))}
            </div>

            <div className="flex gap-3 justify-center mt-5">
              <button
                className="border rounded px-4 py-2"
                onClick={removePhoneme}
              >
                Delete
              </button>

              <button
                className="border rounded px-4 py-2"
                onClick={submitGuess}
              >
                Enter
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
