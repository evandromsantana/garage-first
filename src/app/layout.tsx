import type { Metadata, Viewport } from "next";
import { Merriweather, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { MobileNav } from "@/components/mobile-nav";
import { ErrorBoundary } from "@/components/error-boundary";
import { OfflineIndicator } from "@/components/offline-indicator";
import { ThemeScript } from "@/components/theme-script";
import { QueryProvider } from "@/lib/query-client";

// Font estilo Kindle - serif para leitura confortável
const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

// Font secundária - sans-serif para UI
const inter = Inter({
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
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
      className={`${merriweather.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground tracking-tight selection:bg-foreground/10 pb-16 font-serif">
        <ThemeScript />
        <QueryProvider>
          <ErrorBoundary>
            <OfflineIndicator />
            {children}
          </ErrorBoundary>
          <Toaster position="top-center" />
          <MobileNav />
        </QueryProvider>
      </body>
    </html>
  );
}
