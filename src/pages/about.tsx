import Image from 'next/image';
import Layout from '@/components/Layout';

export default function AboutPage() {
  const skills = {
    languages: ['Python', 'C++', 'R', 'C', 'Java'],
    databases: ['MySQL', 'S3', 'PostgreSQL', 'Spark', 'RDS'],
    frameworks: ['Flask', 'Django', 'TensorFlow', 'React', 'Next.js', 'Selenium', 'RESTful APIs'],
    cloud: ['AWS (Lambda, S3, EC2, RDS)', 'Azure', 'IBM Cloud'],
    cicd: ['Jenkins', 'Docker', 'Kubernetes', 'OpenShift', 'GitHub Actions'],
    analytics: ['Power BI'],
    soft: ['Deliver Results', 'Bias for Action', 'Team Player', 'Self-Initiator', 'Eager to Learn']
  };

  return (
    <Layout
      title="About - Joel Kariyalil"
      description="Learn more about Joel Kariyalil, a software engineer and ML researcher passionate about leveraging technology to drive innovation."
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">About Me</h1>
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="md:w-2/3 space-y-6">
            <div className="prose prose-lg">
              <p>
                An industrious gold medalist in computer science with over 2 years of software development experience in leveraging
                technology to drive innovation. A published Machine Learning researcher and active maintainer of a self-authored open-source
                Python module with over 7000 installations.
              </p>
              <p>
                With strong teamwork skills and a drive to stay at the forefront of technological advancements, I aim to leverage my
                expertise to significantly contribute to the tech landscape.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Skills</h2>
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-lg font-semibold capitalize">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  'Comedy Sketch Writing',
                  'Debating',
                  'Reading',
                  'Playing Guitar',
                  'Cycling',
                  'Playing Polyrhythms'
                ].map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {['Malayalam', 'Kannada', 'Tamil', 'Hindi', 'English'].map((language) => (
                  <span
                    key={language}
                    className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:w-1/3">
            <div className="sticky top-24 space-y-6">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/profilepic.jpg"
                  alt="Joel Kariyalil"
                  width={400}
                  height={400}
                  className="object-cover"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Contact</h3>
                <div className="space-y-2 text-base">
                  <p>
                    <a
                      href="mailto:joelkariyalil.com"
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      joel@example.com
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://github.com/joelkariyalil"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      @joelkariyalil
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://linkedin.com/in/joelkariyalil"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      @joelkariyalil
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://instagram.com/joelkariyalil"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      @joelkariyalil
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
