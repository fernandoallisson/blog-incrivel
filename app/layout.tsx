import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import TweaksPanel from '@/components/TweaksPanel';

export const metadata: Metadata = {
  title: {
    default: 'Blog Incrível Tech',
    template: '%s | Incrível Tech',
  },
  description: 'Tecnologia, legalidade e crescimento em sorteios digitais. Leia artigos sobre conformidade legal, inovação e melhores práticas.',
  keywords: ['blog', 'tecnologia', 'sorteios', 'legalidade', 'incrível tech'],
  authors: [{ name: 'Incrível Tech' }],
  creator: 'Incrível Tech',
  publisher: 'Incrível Tech',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.incrivel.tech',
    siteName: 'Blog Incrível Tech',
    title: 'Blog Incrível Tech',
    description: 'Tecnologia, legalidade e crescimento em sorteios digitais.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.incrivel.tech'}/favicon.png`,
        width: 1200,
        height: 1200,
        alt: 'Logo Incrível Tech',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Incrível Tech',
    description: 'Tecnologia, legalidade e crescimento em sorteios digitais.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.incrivel.tech'}/favicon.png`,
        width: 1200,
        height: 1200,
        alt: 'Logo Incrível Tech',
      },
    ],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.incrivel.tech',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.incrivel.tech'} />
        <link rel="schema.jsonld" href="/schema.json" />
        <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Blog Incrível Tech",
          "description": "Tecnologia, legalidade e crescimento em sorteios digitais.",
          "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.incrivel.tech',
          "logo": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.incrivel.tech'}/favicon.png`,
        }) }} />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-JYNLZLQPEE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JYNLZLQPEE');
          `}
        </Script>
      </head>
      <body>
        <ThemeProvider>
          {children}
          <TweaksPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}
