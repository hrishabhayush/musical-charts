// components/layout.tsx
import React, { ReactNode } from 'react';
import Head from 'next/head';
import Appbar from './Appbar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Melodic Bonding Curve', 
  description = 'Listen to price movements with AI-generated violin music'
}) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Appbar />
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Melodic Bonding Curve</p>
      </footer>
    </div>
  );
};

export default Layout;