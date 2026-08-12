export default function About() {
  return (
    <main className="p-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          About
        </h1>

        <section className="border rounded-lg p-6 space-y-4">

          <p>
            Phoneme Games is a frontend web application for creating
            phoneme-based classroom activities for Speech Pathology
            students and teachers.
          </p>

          <p>
            Assessment 1 focuses on the frontend only. The application
            currently provides a phoneme-based Wordle activity and a
            phoneme Word Search activity.
          </p>

          <p>
            Teachers can configure activities, preview them, and generate
            standalone HTML files that can be opened in a normal web
            browser.
          </p>

          <div className="border-t pt-4">
            <h2 className="text-2xl font-semibold mb-3">
              Student Details
            </h2>

            <p>
              <strong>Name:</strong> Your Name
            </p>

            <p>
              <strong>Student Number:</strong> Your Student Number
            </p>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-2xl font-semibold mb-3">
              Website Demonstration
            </h2>

            <p>
              A short video explaining how to use the website will be
              included here.
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}