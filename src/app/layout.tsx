import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { NotificationProvider } from "@/components/ui/NotificationSystem";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoQuant Latency Visualizer",
  description: "Real-time visualization of cryptocurrency exchange latency across global cloud infrastructure",
  keywords: "cryptocurrency, latency, visualization, exchanges, cloud, AWS, GCP, Azure, trading, blockchain",
  authors: [{ name: "Akshat Kumar", url: "https://github.com/AKR4PC" }],
  creator: "Akshat Kumar",
  publisher: "Akshat Kumar",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-icon.png',
      },
    ],
  },
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1d4ed8' },
  ],
  openGraph: {
    title: 'GoQuant Latency Visualizer',
    description: 'Real-time 3D visualization of cryptocurrency exchange latency across global cloud infrastructure',
    url: 'https://goquant-latency-visualizer.vercel.app',
    siteName: 'GoQuant Latency Visualizer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GoQuant Latency Visualizer - 3D Globe Visualization',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoQuant Latency Visualizer',
    description: 'Real-time 3D visualization of cryptocurrency exchange latency',
    images: ['/og-image.png'],
    creator: '@AKR4PC',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
