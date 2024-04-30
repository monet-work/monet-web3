import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "@/app/thirdweb";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ReactQueryProvider from "@/providers/reactQueryProvider";
import { Toaster } from "sonner";
import SubNavbar from "@/components/sub-navbar";
import AuthWrapper from "@/components/auth-wrapper";

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
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <ReactQueryProvider>
          <ThirdwebProvider>
            <AuthWrapper>
              <Navbar />
              {children}
              <Footer />
            </AuthWrapper>
          </ThirdwebProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
