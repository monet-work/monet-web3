"use client";

import { connectWallet } from "@/app/thirdweb";
import LoginCompany from "@/components/login-company";
import { useConnect } from "thirdweb/react";

const CompanyLoginPage = () => {
  const { connect } = useConnect();
  const handleLoginCompany = () => {
    console.log("handleLoginCompany");
    connectWallet(connect);
  };
  return (
    <main>
      <LoginCompany onClickConnectWallet={handleLoginCompany} />
    </main>
  );
};

export default CompanyLoginPage;
