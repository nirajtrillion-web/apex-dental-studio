import type { Metadata, Viewport } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Apex Dental Studio | Premier Cosmetic & Implant Clinic Mumbai',
  description:
    'Experience precision dentistry & artful smiles at Mumbai’s leading multi-specialty dental clinic in Bandra West & Kandivali East. Invisible aligners, laser whitening, dental implants & painless microscopic root canals.',
  keywords: [
    'Dentist Bandra West',
    'Dentist Kandivali East',
    'Invisible Aligners Mumbai',
    'Laser Teeth Whitening Mumbai',
    'Dental Implants Mumbai',
    'Painless Root Canal Mumbai',
    'Apex Dental Studio',
  ],
  authors: [{ name: 'Apex Dental Studio' }],
  openGraph: {
    title: 'Apex Dental Studio | Luxury Dental Care Mumbai',
    description: 'Precision Dentistry. Artful Smiles. US FDA-approved laser technology & painless treatments.',
    url: 'https://apexdentalstudio.in',
    siteName: 'Apex Dental Studio',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-[#0D9488]/20 selection:text-[#0D9488]">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Toaster richColors position="top-right" closeButton theme="light" />
      </body>
    </html>
  );
}
