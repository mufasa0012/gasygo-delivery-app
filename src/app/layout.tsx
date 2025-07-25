import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { ImageKitProvider } from '@imagekit/next';

export const metadata: Metadata = {
  title: 'GasyGo - Your Reliable Gas Partner, Delivered!',
  description: 'The easiest way to get gas cylinders and accessories delivered to your doorstep in Nairobi.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="font-body antialiased">
        <ImageKitProvider
          urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
          publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
          authenticationEndpoint="/api/imagekit/auth"
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ImageKitProvider>
      </body>
    </html>
  );
}
