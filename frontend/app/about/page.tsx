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
            The project has been developed across the Cloud-Based Web
            Applications assessments. Assessment 1 focused on the frontend,
            Assessment 2 introduced the backend API, PostgreSQL database,
            Prisma ORM, CRUD functionality and Docker support, and
            Assessment 3 adds data-driven reporting, observability and
            testing.
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

          <p>
            Assessment 3 introduces a reporting dashboard that tracks
            application usage, including page views, time on page,
            successful and failed generations, activity creation and
            recent activity. The application also includes API and database
            health monitoring.
          </p>

          <p>
            The final application has also been evaluated using Playwright
            for end-to-end testing, Apache JMeter for load testing, and
            Google Lighthouse for accessibility testing.
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
              A short video demonstration explains the full application,
              including the database-backed activities, dashboard,
              observability, automated testing, load testing and
              accessibility results.
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}