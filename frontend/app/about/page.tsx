export default function About() {
  return (
    <main className="p-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          About
        </h1>

        <section className="border rounded-lg p-6 space-y-4">

          <p>
            Phoneme Games is a full-stack web application for creating
            phoneme-based classroom activities for Speech Pathology
            students and teachers.
          </p>

          <p>
            Assessment 2 extends the original frontend application with a
            backend API, PostgreSQL database, Prisma ORM and Docker support.
          </p>

          <p>
            The application provides phoneme-based Wordle and Word Search
            activities using data stored in the database.
          </p>

          <p>
            Teachers can create and manage words, configure activity sets,
            preview activities, and generate standalone HTML files that can
            be opened in a normal web browser.
          </p>

          <div className="border-t pt-4">
            <h2 className="text-2xl font-semibold mb-3">
              Student Details
            </h2>

            <p>
              <strong>Name:</strong> Lado Suliman
            </p>

            <p>
              <strong>Student Number:</strong> s22462161
            </p>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-2xl font-semibold mb-3">
              Website Demonstration
            </h2>

            <p>
              A short video demonstration explains the backend, database,
              CRUD functionality, activity generation and Docker setup.
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}