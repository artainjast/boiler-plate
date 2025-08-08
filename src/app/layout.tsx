import './globals.css';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'BiziLink',
  description: 'BiziLink',
  openGraph: {
    title: 'BiziLink',
    description: 'BiziLink',
  },
};

export const viewport: Viewport = {
  themeColor: 'black',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// This is the root layout that wraps all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
