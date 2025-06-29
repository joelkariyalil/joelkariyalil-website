import { Inter } from "next/font/google";
import Head from "next/head";
import Footer from "./Footer";
import Navbar from "./Navbar";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  type?: 'default' | 'blog';
  ogImage?: string;
}

export default function Layout({ 
  children,
  title = "Joel Kariyalil",
  description = "Personal website of Joel Kariyalil",
  type = 'default',
  ogImage = "/profilepic.jpg"
}: LayoutProps) {
  return (
    <div className={`min-h-screen bg-white ${inter.className}`}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Navbar />
        <main className={`py-8 ${type === 'blog' ? 'prose dark:prose-invert max-w-none' : ''}`}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
