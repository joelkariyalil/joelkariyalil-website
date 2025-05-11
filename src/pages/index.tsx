import Layout from '@/components/Layout';
import Image from 'next/image';


export default function HomePage() {
  return (
    <Layout title="Home">

      <section className="min-h-screen flex items-center px-6 bg-transparent relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto gap-16">
          {/* LEFT TEXT */}
          <div className="text-left md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Joel Thomas Chacko
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              I'm a software developer who enjoys building minimal, elegant systems that help people think clearly.
              This site is where I occasionally share projects and thoughts.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="md:w-1/2 flex justify-center">
            <div className="w-72 h-72 rounded-full overflow-hidden shadow-md">
              <Image
                src="/profile.jpg"
                alt="Joel Thomas Chacko"
                width={288}
                height={288}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
