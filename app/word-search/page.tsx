"use client";

import { useMemo, useState } from "react";

const wordList = [
  { english: "thin", phonemes: ["θ", "ɪ", "n"] },
  { english: "ship", phonemes: ["ʃ", "ɪ", "p"] },
  { english: "train", phonemes: ["t", "ɹ", "æɪ", "n"] },
  { english: "stamp", phonemes: ["s", "t", "æ", "m", "p"] },
  { english: "frog", phonemes: ["f", "ɹ", "ɔ", "ɡ"] },
];

const fillers = [
  "p",
  "t",
  "k",
  "b",
  "d",
  "ɡ",
  "n",
  "m",
  "ŋ",
  "f",
  "s",
  "θ",
  "ʃ",
  "v",
  "z",
  "ð",
  "ʒ",
  "l",
  "ɹ",
  "w",
  "j",
  "h",
  "ɪ",
  "e",
  "æ",
  "ɐ",
  "ɔ",
];

const directions = [
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
  { row: 1, col: -1 },
  { row: 0, col: -1 },
  { row: -1, col: 0 },
  { row: -1, col: -1 },
  { row: -1, col: 1 },
];

type CellPosition = {
  row: number;
  col: number;
};

function seededRandom(seed: number) {
  let value = seed + 1;

  return function () {
    value += 0x6d2b79f5;

    let result = value;

    result = Math.imul(
      result ^ (result >>> 15),
      result | 1
    );

    result ^= result +
      Math.imul(
        result ^ (result >>> 7),
        result | 61
      );

    return (
      ((result ^ (result >>> 14)) >>> 0) /
      4294967296
    );
  };
}

function makeGrid(seed: number) {
  const size = 8;

  const random = seededRandom(seed);

  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "")
  );

  function canPlaceWord(
    phonemes: string[],
    startRow: number,
    startCol: number,
    rowDirection: number,
    colDirection: number
  ) {
    for (
      let index = 0;
      index < phonemes.length;
      index++
    ) {
      const row =
        startRow + rowDirection * index;

      const col =
        startCol + colDirection * index;

      if (
        row < 0 ||
        row >= size ||
        col < 0 ||
        col >= size
      ) {
        return false;
      }

      if (
        grid[row][col] !== "" &&
        grid[row][col] !== phonemes[index]
      ) {
        return false;
      }
    }

    return true;
  }

  function placeWord(phonemes: string[]) {
    for (let attempt = 0; attempt < 200; attempt++) {
      const direction =
        directions[
          Math.floor(random() * directions.length)
        ];

      const startRow =
        Math.floor(random() * size);

      const startCol =
        Math.floor(random() * size);

      if (
        canPlaceWord(
          phonemes,
          startRow,
          startCol,
          direction.row,
          direction.col
        )
      ) {
        phonemes.forEach((phoneme, index) => {
          const row =
            startRow + direction.row * index;

          const col =
            startCol + direction.col * index;

          grid[row][col] = phoneme;
        });

        return;
      }
    }
  }

  wordList.forEach((word) => {
    placeWord(word.phonemes);
  });

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!grid[row][col]) {
        const fillerIndex =
          Math.floor(random() * fillers.length);

        grid[row][col] =
          fillers[fillerIndex];
      }
    }
  }

  return grid;
}

export default function WordSearch() {
  const [gridVersion, setGridVersion] =
    useState(0);

  const [selectedCells, setSelectedCells] =
    useState<CellPosition[]>([]);

  const [foundWords, setFoundWords] =
    useState<string[]>([]);

  const grid = useMemo(
    () => makeGrid(gridVersion),
    [gridVersion]
  );

  function handleCellClick(
    row: number,
    col: number
  ) {
    const alreadySelected =
      selectedCells.some(
        (cell) =>
          cell.row === row &&
          cell.col === col
      );

    if (alreadySelected) {
      return;
    }

    if (selectedCells.length > 0) {
      const lastCell =
        selectedCells[
          selectedCells.length - 1
        ];

      const rowDifference =
        row - lastCell.row;

      const colDifference =
        col - lastCell.col;

      const isAdjacent =
        Math.abs(rowDifference) <= 1 &&
        Math.abs(colDifference) <= 1 &&
        !(
          rowDifference === 0 &&
          colDifference === 0
        );

      if (!isAdjacent) {
        return;
      }

      if (selectedCells.length >= 2) {
        const previousCell =
          selectedCells[
            selectedCells.length - 2
          ];

        const previousRowDirection =
          lastCell.row -
          previousCell.row;

        const previousColDirection =
          lastCell.col -
          previousCell.col;

        if (
          rowDifference !==
            previousRowDirection ||
          colDifference !==
            previousColDirection
        ) {
          return;
        }
      }
    }

    const newSelection = [
      ...selectedCells,
      { row, col },
    ];

    setSelectedCells(newSelection);

    const selectedPhonemes =
      newSelection
        .map(
          (cell) =>
            grid[cell.row][cell.col]
        )
        .join("");

    const matchedWord =
      wordList.find(
        (word) =>
          word.phonemes.join("") ===
          selectedPhonemes
      );

    if (
      matchedWord &&
      !foundWords.includes(
        matchedWord.english
      )
    ) {
      setFoundWords([
        ...foundWords,
        matchedWord.english,
      ]);

      setTimeout(() => {
        setSelectedCells([]);
      }, 500);
    }
  }

  function clearSelection() {
    setSelectedCells([]);
  }

  function generateNewGrid() {
    setGridVersion(
      (value) => value + 1
    );

    setSelectedCells([]);
    setFoundWords([]);
  }

  function downloadWordSearch() {
    const gridHtml = grid
      .flat()
      .map(
        (phoneme, index) =>
          `<button
            class="cell"
            data-index="${index}"
          >${phoneme}</button>`
      )
      .join("");

    const wordsHtml = wordList
      .map(
        (word) =>
          `<li id="word-${word.english}">
            ${word.english} -
            ${word.phonemes.join(" ")}
          </li>`
      )
      .join("");

    const wordData = JSON.stringify(
      wordList.map((word) => ({
        english: word.english,
        phonemes: word.phonemes,
      }))
    );

    const flatGrid =
      JSON.stringify(grid.flat());

    const html = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Phoneme Word Search</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      text-align: center;
    }

    .grid {
      display: grid;
      grid-template-columns:
        repeat(8, 45px);
      gap: 4px;
      justify-content: center;
      margin: 30px 0;
    }

    .cell {
      width: 45px;
      height: 45px;
      border: 1px solid #555;
      background: white;
      cursor: pointer;
      font-weight: bold;
      font-size: 16px;
    }

    .cell.selected {
      background: #facc15;
    }

    .found {
      text-decoration: line-through;
      font-weight: bold;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    .control {
      padding: 10px 16px;
      margin: 10px;
      cursor: pointer;
    }
  </style>
</head>

<body>

  <h1>Phoneme Word Search</h1>

  <p>
    Click neighbouring phonemes
    in a straight line to find
    each word.
  </p>

  <div class="grid">
    ${gridHtml}
  </div>

  <button
    class="control"
    onclick="clearSelection()"
  >
    Clear Selection
  </button>

  <h2>Find these words</h2>

  <ul>
    ${wordsHtml}
  </ul>

  <script>
    const words = ${wordData};
    const grid = ${flatGrid};

    let selected = [];
    let foundWords = [];

    const cells =
      document.querySelectorAll(".cell");

    cells.forEach((cell) => {
      cell.addEventListener(
        "click",
        () => {
          const index =
            Number(cell.dataset.index);

          if (
            selected.includes(index)
          ) {
            return;
          }

          const row =
            Math.floor(index / 8);

          const col =
            index % 8;

          if (selected.length > 0) {
            const lastIndex =
              selected[
                selected.length - 1
              ];

            const lastRow =
              Math.floor(
                lastIndex / 8
              );

            const lastCol =
              lastIndex % 8;

            const rowDifference =
              row - lastRow;

            const colDifference =
              col - lastCol;

            const isAdjacent =
              Math.abs(
                rowDifference
              ) <= 1 &&
              Math.abs(
                colDifference
              ) <= 1 &&
              !(
                rowDifference === 0 &&
                colDifference === 0
              );

            if (!isAdjacent) {
              return;
            }

            if (
              selected.length >= 2
            ) {
              const previousIndex =
                selected[
                  selected.length - 2
                ];

              const previousRow =
                Math.floor(
                  previousIndex / 8
                );

              const previousCol =
                previousIndex % 8;

              const previousRowDirection =
                lastRow -
                previousRow;

              const previousColDirection =
                lastCol -
                previousCol;

              if (
                rowDifference !==
                  previousRowDirection ||
                colDifference !==
                  previousColDirection
              ) {
                return;
              }
            }
          }

          selected.push(index);

          cell.classList.add(
            "selected"
          );

          const selectedPhonemes =
            selected
              .map(
                (item) =>
                  grid[item]
              )
              .join("");

          const match =
            words.find(
              (word) =>
                word.phonemes.join(
                  ""
                ) ===
                selectedPhonemes
            );

          if (
            match &&
            !foundWords.includes(
              match.english
            )
          ) {
            foundWords.push(
              match.english
            );

            document
              .getElementById(
                "word-" +
                match.english
              )
              .classList.add(
                "found"
              );

            setTimeout(
              clearSelection,
              500
            );
          }
        }
      );
    });

    function clearSelection() {
      selected = [];

      cells.forEach((cell) => {
        cell.classList.remove(
          "selected"
        );
      });
    }
  </script>

</body>

</html>
`;

    const blob = new Blob(
      [html],
      {
        type: "text/html",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "phoneme-word-search.html";

    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          Word Search Builder
        </h1>

        <div className="grid gap-8 lg:grid-cols-2">

          <section className="border rounded-lg p-6">

            <h2 className="text-2xl font-semibold mb-4">
              Words
            </h2>

            <p className="mb-4">
              Click neighbouring phonemes
              in a straight line to find
              each word.
            </p>

            <ul className="space-y-3">

              {wordList.map(
                (word) => (
                  <li
                    key={
                      word.english
                    }
                    className={`border rounded p-3 ${
                      foundWords.includes(
                        word.english
                      )
                        ? "line-through font-bold"
                        : ""
                    }`}
                  >
                    <strong>
                      {word.english}
                    </strong>

                    <div className="mt-1">
                      {word.phonemes.join(
                        " "
                      )}
                    </div>
                  </li>
                )
              )}

            </ul>

            <div className="flex flex-wrap gap-3 mt-6">

              <button
                onClick={
                  generateNewGrid
                }
                className="border rounded px-4 py-2"
              >
                Generate New Grid
              </button>

              <button
                onClick={
                  clearSelection
                }
                className="border rounded px-4 py-2"
              >
                Clear Selection
              </button>

              <button
                onClick={
                  downloadWordSearch
                }
                className="border rounded px-4 py-2"
              >
                Generate HTML
              </button>

            </div>
          </section>

          <section className="border rounded-lg p-6">

            <h2 className="text-2xl font-semibold mb-4">
              Activity Preview
            </h2>

            <div
              className="grid gap-1 justify-center"
              style={{
                gridTemplateColumns:
                  "repeat(8, 42px)",
              }}
            >
              {grid.map(
                (
                  row,
                  rowIndex
                ) =>
                  row.map(
                    (
                      phoneme,
                      colIndex
                    ) => {
                      const selected =
                        selectedCells.some(
                          (cell) =>
                            cell.row ===
                              rowIndex &&
                            cell.col ===
                              colIndex
                        );

                      return (
                        <button
                          key={`${rowIndex}-${colIndex}`}
                          onClick={() =>
                            handleCellClick(
                              rowIndex,
                              colIndex
                            )
                          }
                          aria-label={`Phoneme ${phoneme}`}
                          className={`w-10 h-10 border rounded flex items-center justify-center font-semibold ${
                            selected
                              ? "bg-yellow-400 text-black"
                              : ""
                          }`}
                        >
                          {phoneme}
                        </button>
                      );
                    }
                  )
              )}
            </div>

            <p className="text-center mt-5">
              Found:{" "}
              {foundWords.length} /{" "}
              {wordList.length}
            </p>

          </section>

        </div>
      </div>
    </main>
  );
}