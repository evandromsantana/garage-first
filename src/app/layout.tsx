import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { MobileNav } from "@/components/mobile-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: "Garage-First | Ninja 400",
  description: "Sistema de gestão e procedência extrema para Kawasaki Ninja 400",
  manifest: "/manifest.json",
  openGraph: {
    title: "Passaporte Mecânico | Ninja 400",
    description: "Confira o rigor de manutenção e as métricas de procedência desta Kawasaki.",
    siteName: "Garage Ninja PWA",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('dark'); localStorage.removeItem('theme');`
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground tracking-tight selection:bg-foreground/10 pb-16">
        {children}
        <Toaster position="top-center" />
        <MobileNav />
      </body>
    </html>
  );
}
