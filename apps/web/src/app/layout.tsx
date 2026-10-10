import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VyBot — Universal AI Agent Platform',
  description: 'Connect any API, Webhook, or MCP. Let AI handle the rest 24/7.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
