"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Word = {
  id: number;
  english: string;
  hint: string | null;
  phonemes: string[];
};

type Activity = {
  id: number;
  name: string;
  type: "WORDLE" | "WORD_SEARCH";
  difficulty: string;
  maxGuesses: number;
  showHints: boolean;
  gridSize: number;
  outputTitle: string;
  wordIds: number[];
};

export default function ManageData() {
  const [words, setWords] = useState<Word[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [message, setMessage] = useState("");

  const [editingWordId, setEditingWordId] = useState<number | null>(null);
  const [editingActivityId, setEditingActivityId] = useState<number | null>(
    null
  );

  const [english, setEnglish] = useState("");
  const [phonemes, setPhonemes] = useState("");
  const [hint, setHint] = useState("");

  const [activityName, setActivityName] = useState("");
  const [activityType, setActivityType] =
    useState<"WORDLE" | "WORD_SEARCH">("WORDLE");
  const [selectedWordIds, setSelectedWordIds] = useState<number[]>([]);

  const load = useCallback(async () => {
    const [wordResponse, activityResponse] = await Promise.all([
      fetch("/api/words", { cache: "no-store" }),
      fetch("/api/activities", { cache: "no-store" }),
    ]);

    const wordData = await wordResponse.json();
    const activityData = await activityResponse.json();

    setWords(wordData.words ?? []);
    setActivities(activityData.activities ?? []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  function resetWordForm() {
    setEditingWordId(null);
    setEnglish("");
    setPhonemes("");
    setHint("");
  }

  async function submitWord(event: FormEvent) {
    event.preventDefault();

    const payload = {
      english,
      phonemes: phonemes.split(/\s+/).filter(Boolean),
      hint,
    };

    const response = await fetch(
      editingWordId ? `/api/words/${editingWordId}` : "/api/words",
      {
        method: editingWordId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    setMessage(
      response.ok
        ? `Word ${editingWordId ? "updated" : "created"} successfully.`
        : data.error ?? "Request failed."
    );

    if (response.ok) {
      resetWordForm();
      await load();
    }
  }

  function editWord(word: Word) {
    setEditingWordId(word.id);
    setEnglish(word.english);
    setPhonemes(word.phonemes.join(" "));
    setHint(word.hint ?? "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function removeWord(id: number) {
    if (
      !window.confirm(
        "Delete this word? It will also be removed from saved activities."
      )
    ) {
      return;
    }

    const response = await fetch(`/api/words/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    setMessage(
      response.ok ? "Word deleted." : data.error ?? "Delete failed."
    );

    await load();
  }

  function resetActivityForm() {
    setEditingActivityId(null);
    setActivityName("");
    setActivityType("WORDLE");
    setSelectedWordIds([]);
  }

  function editActivity(activity: Activity) {
    setEditingActivityId(activity.id);
    setActivityName(activity.name);
    setActivityType(activity.type);
    setSelectedWordIds(activity.wordIds);

    setTimeout(() => {
      document.getElementById("activity-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  async function submitActivity(event: FormEvent) {
    event.preventDefault();

    const payload = {
      name: activityName,
      type: activityType,
      difficulty: "standard",
      maxGuesses: 6,
      showHints: true,
      gridSize: 8,
      outputTitle: activityName,
      wordIds: selectedWordIds,
    };

    const response = await fetch(
      editingActivityId
        ? `/api/activities/${editingActivityId}`
        : "/api/activities",
      {
        method: editingActivityId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    setMessage(
      response.ok
        ? `Activity configuration ${
            editingActivityId ? "updated" : "saved"
          }.`
        : data.error ?? "Request failed."
    );

    if (response.ok) {
      resetActivityForm();
      await load();
    }
  }

  async function removeActivity(id: number) {
    if (!window.confirm("Delete this activity configuration?")) {
      return;
    }

    const response = await fetch(`/api/activities/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    setMessage(
      response.ok ? "Activity deleted." : data.error ?? "Delete failed."
    );

    await load();
  }

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-bold mb-3">Backend Data Manager</h1>

          <p>
            Create, read, update and delete database-backed words and activity
            configurations.
          </p>

          {message && (
            <p className="mt-4 border rounded p-3 font-medium">{message}</p>
          )}
        </div>

        <section className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {editingWordId ? "Edit Word" : "Create Word"}
          </h2>

          <form
            onSubmit={submitWord}
            className="grid gap-4 md:grid-cols-3"
          >
            <label>
              English word
              <input
                className="block mt-1 border rounded px-3 py-2 w-full bg-transparent"
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
                required
              />
            </label>

            <label>
              Phonemes (space separated)
              <input
                className="block mt-1 border rounded px-3 py-2 w-full bg-transparent"
                value={phonemes}
                onChange={(e) => setPhonemes(e.target.value)}
                placeholder="t ɹ æɪ n"
                required
              />
            </label>

            <label>
              Hint
              <input
                className="block mt-1 border rounded px-3 py-2 w-full bg-transparent"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="Optional hint"
              />
            </label>

            <div className="md:col-span-3 flex gap-3">
              <button
                className="border rounded px-4 py-2"
                type="submit"
              >
                {editingWordId ? "Save Changes" : "Add Word"}
              </button>

              {editingWordId && (
                <button
                  className="border rounded px-4 py-2"
                  type="button"
                  onClick={resetWordForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Stored Words</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Word</th>
                  <th className="border p-2">Phonemes</th>
                  <th className="border p-2">Hint</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {words.map((word) => (
                  <tr key={word.id}>
                    <td className="border p-2 font-semibold">
                      {word.english}
                    </td>

                    <td className="border p-2">
                      {word.phonemes.join(" ")}
                    </td>

                    <td className="border p-2">
                      {word.hint || "—"}
                    </td>

                    <td className="border p-2">
                      <div className="flex gap-2">
                        <button
                          className="border rounded px-3 py-1"
                          onClick={() => editWord(word)}
                        >
                          Edit
                        </button>

                        <button
                          className="border rounded px-3 py-1"
                          onClick={() => removeWord(word.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          id="activity-form"
          className="border rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">
            {editingActivityId
              ? "Edit Activity Configuration"
              : "Create Activity Configuration"}
          </h2>

          <form
            onSubmit={submitActivity}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                Activity name
                <input
                  className="block mt-1 border rounded px-3 py-2 w-full bg-transparent"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  required
                />
              </label>

              <label>
                Type
                <select
                  className="block mt-1 border rounded px-3 py-2 w-full bg-transparent"
                  value={activityType}
                  onChange={(e) =>
                    setActivityType(
                      e.target.value as "WORDLE" | "WORD_SEARCH"
                    )
                  }
                >
                  <option value="WORDLE">Wordle</option>
                  <option value="WORD_SEARCH">Word Search</option>
                </select>
              </label>
            </div>

            <fieldset>
              <legend className="font-medium mb-2">
                Words in this activity
              </legend>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {words.map((word) => (
                  <label
                    key={word.id}
                    className="border rounded p-2 flex gap-2 items-center"
                  >
                    <input
                      type="checkbox"
                      checked={selectedWordIds.includes(word.id)}
                      onChange={(e) =>
                        setSelectedWordIds((current) =>
                          e.target.checked
                            ? [...current, word.id]
                            : current.filter((id) => id !== word.id)
                        )
                      }
                    />

                    {word.english} / {word.phonemes.join(" ")}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex gap-3">
              <button
                className="border rounded px-4 py-2"
                type="submit"
              >
                {editingActivityId ? "Save Changes" : "Save Activity"}
              </button>

              {editingActivityId && (
                <button
                  className="border rounded px-4 py-2"
                  type="button"
                  onClick={resetActivityForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Saved Activity Configurations
          </h2>

          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="border rounded p-4 flex flex-wrap justify-between gap-3"
              >
                <div>
                  <strong>{activity.name}</strong>

                  <div>
                    {activity.type === "WORDLE"
                      ? "Wordle"
                      : "Word Search"}{" "}
                    · {activity.wordIds.length} words ·{" "}
                    {activity.difficulty}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="border rounded px-3 py-1"
                    onClick={() => editActivity(activity)}
                  >
                    Edit
                  </button>

                  <button
                    className="border rounded px-3 py-1"
                    onClick={() => removeActivity(activity.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}