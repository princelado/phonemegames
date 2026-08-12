"use client";

import { useState } from "react";

const words = [
  { english: "thin", phonemes: ["θ", "ɪ", "n"] },
  { english: "ship", phonemes: ["ʃ", "ɪ", "p"] },
  { english: "train", phonemes: ["t", "ɹ", "æɪ", "n"] },
  { english: "stamp", phonemes: ["s", "t", "æ", "m", "p"] },
];

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
  const [selectedWord, setSelectedWord] = useState(words[0]);
  const [maxGuesses, setMaxGuesses] = useState(6);
  const [showHints, setShowHints] = useState(true);

  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [submittedGuesses, setSubmittedGuesses] = useState<string[][]>([]);
  const [gameWon, setGameWon] = useState(false);

  function resetGame() {
    setCurrentGuess([]);
    setSubmittedGuesses([]);
    setGameWon(false);
  }

  function addPhoneme(phoneme: string) {
    if (
      currentGuess.length < selectedWord.phonemes.length &&
      !gameWon &&
      submittedGuesses.length < maxGuesses
    ) {
      setCurrentGuess([...currentGuess, phoneme]);
    }
  }

  function removePhoneme() {
    setCurrentGuess(currentGuess.slice(0, -1));
  }

  function submitGuess() {
    if (currentGuess.length !== selectedWord.phonemes.length) {
      return;
    }

    const newGuesses = [...submittedGuesses, currentGuess];

    setSubmittedGuesses(newGuesses);

    const correct =
      currentGuess.join("") === selectedWord.phonemes.join("");

    if (correct) {
      setGameWon(true);
    }

    setCurrentGuess([]);
  }

  function getCellStyle(phoneme: string, index: number) {
    if (phoneme === selectedWord.phonemes[index]) {
      return "bg-green-600 text-white";
    }

    if (selectedWord.phonemes.includes(phoneme)) {
      return "bg-yellow-500 text-black";
    }

    return "bg-gray-600 text-white";
  }

  function downloadWordle() {
    const answerPhonemes = JSON.stringify(selectedWord.phonemes);
    const keyboardData = JSON.stringify(keyboard);
    const hintsData = JSON.stringify(hintText);

    const html = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Phoneme Wordle</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 20px;
      text-align: center;
      background: #ffffff;
      color: #171717;
    }

    .grid {
      margin: 30px 0;
    }

    .row {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin-bottom: 6px;
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

    .key {
      min-width: 42px;
      padding: 10px;
      border: 1px solid #777;
      background: white;
      cursor: pointer;
      border-radius: 5px;
    }

    .controls {
      margin-top: 20px;
    }

    .control {
      padding: 10px 18px;
      margin: 5px;
      cursor: pointer;
    }

    #message {
      font-weight: bold;
      margin: 20px 0;
    }
  </style>
</head>

<body>

  <h1>Phoneme Wordle</h1>

  <p>
    Build your guess using the phoneme keyboard.
  </p>

  <p>
    Maximum guesses: ${maxGuesses}
  </p>

  <div id="grid" class="grid"></div>

  <div id="message"></div>

  <div id="keyboard" class="keyboard"></div>

  <div class="controls">
    <button
      class="control"
      onclick="removePhoneme()"
    >
      Delete
    </button>

    <button
      class="control"
      onclick="submitGuess()"
    >
      Enter
    </button>
  </div>

  <script>
    const answer = ${answerPhonemes};
    const englishAnswer = ${JSON.stringify(selectedWord.english)};
    const keyboard = ${keyboardData};
    const hints = ${hintsData};

    const maxGuesses = ${maxGuesses};
    const showHints = ${showHints};

    let currentGuess = [];
    let submittedGuesses = [];
    let gameWon = false;

    const gridElement =
      document.getElementById("grid");

    const keyboardElement =
      document.getElementById("keyboard");

    const messageElement =
      document.getElementById("message");

    function createKeyboard() {
      keyboard.forEach((phoneme) => {
        const button =
          document.createElement("button");

        button.textContent = phoneme;
        button.className = "key";

        if (showHints) {
          button.title =
            hints[phoneme] || "/" + phoneme + "/";
        }

        button.setAttribute(
          "aria-label",
          hints[phoneme] || "Phoneme " + phoneme
        );

        button.onclick = () =>
          addPhoneme(phoneme);

        keyboardElement.appendChild(button);
      });
    }

    function addPhoneme(phoneme) {
      if (
        gameWon ||
        submittedGuesses.length >= maxGuesses ||
        currentGuess.length >= answer.length
      ) {
        return;
      }

      currentGuess.push(phoneme);

      renderGrid();
    }

    function removePhoneme() {
      currentGuess.pop();

      renderGrid();
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
        currentGuess.join("") ===
        answer.join("");

      currentGuess = [];

      if (correct) {
        gameWon = true;

        messageElement.textContent =
          "Correct! English word: " +
          englishAnswer;
      }

      if (
        !gameWon &&
        submittedGuesses.length >= maxGuesses
      ) {
        messageElement.textContent =
          "No guesses remaining. Answer: " +
          englishAnswer;
      }

      renderGrid();
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

    function renderGrid() {
      gridElement.innerHTML = "";

      submittedGuesses.forEach((guess) => {
        const row =
          document.createElement("div");

        row.className = "row";

        guess.forEach((phoneme, index) => {
          const cell =
            document.createElement("div");

          cell.className =
            "cell " +
            getStatus(phoneme, index);

          cell.textContent = phoneme;

          row.appendChild(cell);
        });

        gridElement.appendChild(row);
      });

      if (
        !gameWon &&
        submittedGuesses.length < maxGuesses
      ) {
        const currentRow =
          document.createElement("div");

        currentRow.className = "row";

        for (
          let index = 0;
          index < answer.length;
          index++
        ) {
          const cell =
            document.createElement("div");

          cell.className = "cell";

          cell.textContent =
            currentGuess[index] || "";

          currentRow.appendChild(cell);
        }

        gridElement.appendChild(currentRow);
      }
    }

    createKeyboard();
    renderGrid();
  </script>

</body>

</html>
`;

    const blob = new Blob(
      [html],
      { type: "text/html" }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "phoneme-wordle.html";

    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Wordle Builder
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">

          <section className="border rounded-lg p-6 space-y-6">

            <h2 className="text-2xl font-semibold">
              Game Settings
            </h2>

            <div>

              <label className="block mb-2 font-medium">
                Choose a word
              </label>

              <select
                value={selectedWord.english}
                onChange={(e) => {
                  const word = words.find(
                    (item) =>
                      item.english === e.target.value
                  );

                  if (word) {
                    setSelectedWord(word);
                    resetGame();
                  }
                }}
                className="border rounded px-3 py-2 w-full bg-transparent"
              >
                {words.map((word) => (
                  <option
                    key={word.english}
                    value={word.english}
                  >
                    {word.english}
                  </option>
                ))}
              </select>

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Number of guesses
              </label>

              <input
                type="number"
                min="3"
                max="8"
                value={maxGuesses}
                onChange={(e) =>
                  setMaxGuesses(
                    Number(e.target.value)
                  )
                }
                className="border rounded px-3 py-2 w-full bg-transparent"
              />

            </div>

            <label className="flex gap-3 items-center">

              <input
                type="checkbox"
                checked={showHints}
                onChange={(e) =>
                  setShowHints(
                    e.target.checked
                  )
                }
              />

              Show phoneme hints

            </label>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={resetGame}
                className="border rounded px-4 py-2"
              >
                Reset Game
              </button>

              <button
                onClick={downloadWordle}
                className="border rounded px-4 py-2"
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
              submittedGuesses.length <
                maxGuesses && (
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
              <div className="text-center mb-6">

                <p className="text-xl font-bold">
                  Correct!
                </p>

                <p className="mt-2">
                  English word:{" "}
                  <strong>
                    {selectedWord.english}
                  </strong>
                </p>

              </div>
            )}

            {!gameWon &&
              submittedGuesses.length >=
                maxGuesses && (
                <div className="text-center mb-6">

                  <p className="font-bold">
                    No guesses remaining.
                  </p>

                  <p>
                    Answer:{" "}
                    <strong>
                      {selectedWord.english}
                    </strong>
                  </p>

                </div>
              )}

            <div className="border-t pt-6">

              <h3 className="font-semibold mb-4">
                Phoneme Keyboard
              </h3>

              <div className="flex flex-wrap gap-2 justify-center">

                {keyboard.map((phoneme) => (
                  <button
                    key={phoneme}
                    onClick={() =>
                      addPhoneme(phoneme)
                    }
                    title={
                      showHints
                        ? hintText[phoneme] ||
                          `/${phoneme}/`
                        : undefined
                    }
                    aria-label={
                      hintText[phoneme] ||
                      `Phoneme ${phoneme}`
                    }
                    className="border rounded px-3 py-2 min-w-11 hover:bg-gray-200 hover:text-black"
                  >
                    {phoneme}
                  </button>
                ))}

              </div>

              <div className="flex justify-center gap-3 mt-5">

                <button
                  onClick={removePhoneme}
                  className="border rounded px-5 py-2"
                >
                  Delete
                </button>

                <button
                  onClick={submitGuess}
                  className="border rounded px-5 py-2 font-semibold"
                >
                  Enter
                </button>

              </div>

            </div>

          </section>

        </div>
      </div>
    </main>
  );
}