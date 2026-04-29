import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boundary";

export const metadata: Metadata = {
  title: "Login | Garage Ninja",
  description: "Faça login para acessar seu painel de gestão veicular",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground tracking-tight selection:bg-foreground/10">
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      <Toaster position="top-center" />
    </div>
  );
}
