import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "@/app/contract-utils";
import Footer from "@/components/footer";
import ReactQueryProvider from "@/providers/reactQueryProvider";
import { Toaster } from "sonner";
import AuthWrapper from "@/components/auth-wrapper";
import { AuthProvider } from "@/context/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monet Points",
  description:
    "Monet Points is a decentralized application for managing points.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className={inter.className}>
        <ReactQueryProvider>
          <ThirdwebProvider>
            <AuthProvider>{children}</AuthProvider>
            <Footer />
          </ThirdwebProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
