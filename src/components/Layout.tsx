import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundCanvas from '@/components/BackgroundCanvas';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'My Site' }) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="description" content="Personal website" />
    </Head>
    <div className="flex flex-col min-h-screen bg-white text-black relative">
      <Navbar />
      <BackgroundCanvas />
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <Footer />
    </div>
  </>
);

export default Layout;
