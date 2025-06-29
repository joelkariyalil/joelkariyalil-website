import Layout from "@/components/Layout";

export default function Resume() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="gradient-text text-4xl font-bold">Resume</h1>
        
        <div className="max-w-2xl text-center">
          <p className="mb-8 text-lg text-gray-600">
            Download my resume to learn more about my experience and skills.
          </p>
          
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="button-hover inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Resume
          </a>
        </div>

        <div className="mt-12 w-full max-w-4xl rounded-lg border bg-white p-8 shadow-lg">
          <div className="prose mx-auto">
            <h2>Experience Highlights</h2>
            <ul>
              <li>Current role and responsibilities</li>
              <li>Previous positions and achievements</li>
              <li>Notable projects and contributions</li>
            </ul>

            <h2>Technical Skills</h2>
            <ul>
              <li>Programming Languages</li>
              <li>Frameworks & Libraries</li>
              <li>Tools & Technologies</li>
            </ul>

            <h2>Education</h2>
            <ul>
              <li>Degree and major</li>
              <li>University name</li>
              <li>Graduation year</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
} 