import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider, client } from "@/app/thirdweb";
import Footer from "@/components/footer";
import ReactQueryProvider from "@/providers/reactQueryProvider";
import { Toaster } from "sonner";

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
            {children}
            <Footer />
          </ThirdwebProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
