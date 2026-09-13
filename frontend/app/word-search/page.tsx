"use client";

import { useEffect, useMemo, useState } from "react";

type Word = {
  id: number;
  english: string;
  phonemes: string[];
};

type Activity = {
  id: number;
  name: string;
  gridSize: number;
  outputTitle: string;
  words: Word[];
};

type CellPosition = {
  row: number;
  col: number;
};

const fillers = [
  "p", "t", "k",
  "b", "d", "ɡ",
  "n", "m", "ŋ",
  "f", "s", "θ", "ʃ",
  "v", "z", "ð", "ʒ",
  "l", "ɹ", "w", "j",
  "h", "ɪ", "e", "æ",
  "ɐ", "ɔ",
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

function makeGrid(
  words: Word[],
  size: number,
  seed: number
) {
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
    for (
      let attempt = 0;
      attempt < 300;
      attempt++
    ) {
      const direction =
        directions[
          Math.floor(
            random() * directions.length
          )
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
        phonemes.forEach(
          (phoneme, index) => {
            const row =
              startRow + direction.row * index;

            const col =
              startCol + direction.col * index;

            grid[row][col] = phoneme;
          }
        );

        return;
      }
    }
  }

  words.forEach((word) => {
    placeWord(word.phonemes);
  });

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!grid[row][col]) {
        const fillerIndex =
          Math.floor(
            random() * fillers.length
          );

        grid[row][col] =
          fillers[fillerIndex];
      }
    }
  }

  return grid;
}

export default function WordSearch() {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [activityId, setActivityId] =
    useState<number | null>(null);

  const [gridVersion, setGridVersion] =
    useState(0);

  const [selectedCells, setSelectedCells] =
    useState<CellPosition[]>([]);

  const [foundWords, setFoundWords] =
    useState<string[]>([]);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetch("/api/activities?type=WORD_SEARCH", {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data) => {
        const loadedActivities =
          data.activities ?? [];

        setActivities(loadedActivities);

        if (loadedActivities[0]) {
          setActivityId(
            loadedActivities[0].id
          );
        }
      })
      .catch(() => {
        setError(
          "Unable to load stored Word Search activities."
        );
      });
  }, []);

  const activity = useMemo(
    () =>
      activities.find(
        (item) => item.id === activityId
      ) ?? null,
    [activities, activityId]
  );

  const words = useMemo(
    () => activity?.words ?? [],
    [activity]
  );

  const size = activity?.gridSize ?? 8;

  const grid = useMemo(
    () =>
      makeGrid(
        words,
        size,
        gridVersion
      ),
    [words, size, gridVersion]
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

        const previousRowDifference =
          lastCell.row - previousCell.row;

        const previousColDifference =
          lastCell.col - previousCell.col;

        if (
          rowDifference !== previousRowDifference ||
          colDifference !== previousColDifference
        ) {
          return;
        }
      }
    }

    const nextSelection = [
      ...selectedCells,
      { row, col },
    ];

    setSelectedCells(nextSelection);

    const selectedPhonemes =
      nextSelection
        .map(
          (cell) =>
            grid[cell.row][cell.col]
        )
        .join("");

    const match = words.find(
      (word) =>
        word.phonemes.join("") ===
        selectedPhonemes
    );

    if (
      match &&
      !foundWords.includes(match.english)
    ) {
      setFoundWords([
        ...foundWords,
        match.english,
      ]);

      setTimeout(() => {
        setSelectedCells([]);
      }, 400);
    }
  }

  function resetGrid() {
    setGridVersion(
      (version) => version + 1
    );

    setSelectedCells([]);
    setFoundWords([]);
  }

  function downloadWordSearch() {
    if (!activity) {
      return;
    }

    const flatGrid = grid.flat();

    const cells = flatGrid
      .map(
        (phoneme, index) =>
          `<button class="cell" data-index="${index}">${phoneme}</button>`
      )
      .join("");

    const wordList = words
      .map(
        (word) =>
          `<li id="word-${word.id}">${word.english} - ${word.phonemes.join(" ")}</li>`
      )
      .join("");

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
      max-width: 850px;
      margin: 40px auto;
      text-align: center;
      padding: 20px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(${size}, 45px);
      gap: 4px;
      justify-content: center;
      margin: 30px;
    }

    .cell {
      width: 45px;
      height: 45px;
      background: white;
      border: 1px solid #555;
      cursor: pointer;
    }

    .selected {
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
  </style>
</head>
<body>
  <h1>${activity.outputTitle}</h1>

  <p>
    Click neighbouring phonemes in a straight line.
  </p>

  <div class="grid">
    ${cells}
  </div>

  <button onclick="clearSelection()">
    Clear Selection
  </button>

  <h2>Find these words</h2>

  <ul>
    ${wordList}
  </ul>

  <script>
    const words = ${JSON.stringify(words)};
    const grid = ${JSON.stringify(flatGrid)};
    const size = ${size};

    let selected = [];
    let found = [];

    const cells =
      document.querySelectorAll(".cell");

    cells.forEach((cell) => {
      cell.onclick = () => {
        const index =
          Number(cell.dataset.index);

        if (selected.includes(index)) {
          return;
        }

        const row =
          Math.floor(index / size);

        const col =
          index % size;

        if (selected.length) {
          const last =
            selected[selected.length - 1];

          const lastRow =
            Math.floor(last / size);

          const lastCol =
            last % size;

          const rowDifference =
            row - lastRow;

          const colDifference =
            col - lastCol;

          if (
            Math.abs(rowDifference) > 1 ||
            Math.abs(colDifference) > 1 ||
            (
              rowDifference === 0 &&
              colDifference === 0
            )
          ) {
            return;
          }

          if (selected.length >= 2) {
            const previous =
              selected[selected.length - 2];

            const previousRow =
              Math.floor(previous / size);

            const previousCol =
              previous % size;

            if (
              rowDifference !==
                lastRow - previousRow ||
              colDifference !==
                lastCol - previousCol
            ) {
              return;
            }
          }
        }

        selected.push(index);
        cell.classList.add("selected");

        const value =
          selected
            .map((item) => grid[item])
            .join("");

        const match = words.find(
          (word) =>
            word.phonemes.join("") === value
        );

        if (
          match &&
          !found.includes(match.english)
        ) {
          found.push(match.english);

          document
            .getElementById("word-" + match.id)
            .classList.add("found");

          setTimeout(
            clearSelection,
            400
          );
        }
      };
    });

    function clearSelection() {
      selected = [];

      cells.forEach((cell) => {
        cell.classList.remove("selected");
      });
    }
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
    link.download = "phoneme-word-search.html";
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

  if (!activity) {
    return (
      <main className="p-8">
        <p>Loading stored Word Search data...</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-3">
          Word Search Builder
        </h1>

        <p className="mb-8">
          Choose a saved activity from the database and generate a phoneme word search.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Activity Settings
            </h2>

            <label className="block mb-5">
              Configuration

              <select
                className="block mt-1 border rounded px-3 py-2 w-full bg-transparent"
                value={activity.id}
                onChange={(event) => {
                  setActivityId(
                    Number(event.target.value)
                  );

                  resetGrid();
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

            <h3 className="font-semibold mb-2">
              Words
            </h3>

            <ul className="space-y-2">
              {words.map((word) => (
                <li
                  key={word.id}
                  className={`border rounded p-3 ${
                    foundWords.includes(word.english)
                      ? "line-through font-bold"
                      : ""
                  }`}
                >
                  <strong>{word.english}</strong>
                  <div>
                    {word.phonemes.join(" ")}
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                className="border rounded px-4 py-2"
                onClick={resetGrid}
              >
                Generate New Grid
              </button>

              <button
                className="border rounded px-4 py-2"
                onClick={() =>
                  setSelectedCells([])
                }
              >
                Clear Selection
              </button>

              <button
                className="border rounded px-4 py-2"
                onClick={downloadWordSearch}
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
                  `repeat(${size}, 42px)`,
              }}
            >
              {grid.map((row, rowIndex) =>
                row.map(
                  (phoneme, colIndex) => {
                    const selected =
                      selectedCells.some(
                        (cell) =>
                          cell.row === rowIndex &&
                          cell.col === colIndex
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
                        className={`w-10 h-10 border rounded font-semibold ${
                          selected
                            ? "bg-yellow-300 text-black"
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

            <p className="mt-5 text-center">
              Found {foundWords.length} of {words.length} words.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
