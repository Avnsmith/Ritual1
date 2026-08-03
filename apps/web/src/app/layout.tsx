import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '../components/Navbar';
import { WalletModal } from '../components/WalletModal';

export const metadata: Metadata = {
  title: 'WowWeb | Autonomous AI Browser Agent on RitualNet',
  description: "Don't browse. Just ask. Autonomous web research & verifiable execution proofs on RitualNet.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-zinc-100 min-h-screen flex flex-col font-sans antialiased">
        <Providers>
          <Navbar />
          <WalletModal />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
            {children}
          </main>
          <footer className="border-t border-border/60 py-6 px-8 text-center text-xs text-zinc-500 font-mono">
            WowWeb &copy; 2026 — Powered by <a href="https://docs.ritualfoundation.org" target="_blank" rel="noopener noreferrer" className="text-ritual hover:underline">RitualNet (Chain ID: 1979)</a>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
