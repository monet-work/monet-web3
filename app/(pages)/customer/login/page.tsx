"use client";

import { connectWallet } from "@/app/thirdweb";
import LoginCustomer from "@/components/login-customer";
import { useConnect } from "thirdweb/react";

const CustomerLoginPage = () => {
  const { connect } = useConnect();
  const handleLoginCustomer = () => {
    console.log("handleLoginCustomer");
    connectWallet(connect);
  };
  return (
    <main>
      <LoginCustomer onClickConnectWallet={handleLoginCustomer} />
    </main>
  );
};

export default CustomerLoginPage;
