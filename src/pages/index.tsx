import Image from 'next/image';
import Layout from '@/components/Layout';

export default function HomePage() {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col-reverse gap-12 md:flex-row md:items-center md:justify-between max-w-4xl mx-auto px-4">
          <div className="space-y-6 md:w-2/3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Hey, I&apos;m Joel Kariyalil
            </h1>
            <p className="text-xl text-gray-600">
              I&apos;m a software engineer passionate about building elegant solutions to complex problems.
              I write about software development, technology, and my experiences.
            </p>
          </div>
          <div className="mx-auto md:w-1/3">
            <div className="relative aspect-square overflow-hidden rounded-full hover:scale-105 transition-transform duration-300">
              <Image
                src="/profilepic.jpg"
                alt="Joel Kariyalil"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
