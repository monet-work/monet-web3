import type { Metadata } from "next";
import Navbar from "@/components/v1/navbar";
import SubNavbar from "@/components/sub-navbar";
import AuthWrapper from "@/components/auth-wrapper";


export const metadata: Metadata = {
  title: "Monet Points",
  description:
    "Monet Points is a decentralized application for managing points.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthWrapper>
      <Navbar />
      <SubNavbar />
      {children}
    </AuthWrapper>
  );
}