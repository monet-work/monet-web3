import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "@/app/thirdweb";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ReactQueryProvider from "@/providers/reactQueryProvider";
import { Toaster } from "sonner";
import { getCustomer } from "@/lib/api-requests";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useActiveWallet } from "thirdweb/react";
import { useCustomerStore } from "@/store/customerStore";
import Auth from "@/components/auth";
import SubNavbar from "@/components/sub-navbar";

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
            <Auth />
            <Navbar />
            <SubNavbar />
            {children}
            <Footer />
          </ThirdwebProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
