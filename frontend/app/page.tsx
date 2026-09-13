import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <section className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">Phoneme Games</h2>

        <p className="text-lg mb-8">
          Create simple phoneme-based classroom activities for Speech Pathology students.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-2">Wordle</h3>

            <p className="mb-4">
              Build a Wordle-style activity using phoneme symbols.
            </p>

            <Link
              href="/wordle"
              className="inline-block border rounded px-4 py-2"
            >
              Create Wordle
            </Link>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-2">Word Search</h3>

            <p className="mb-4">
              Build a word search using phoneme-based words.
            </p>

            <Link
              href="/word-search"
              className="inline-block border rounded px-4 py-2"
            >
              Create Word Search
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}