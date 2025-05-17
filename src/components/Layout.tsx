import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Joel Thomas Chacko' }) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="description" content="Personal website" />
    </Head>
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <Footer />
    </div>
  </>
);

export default Layout;
