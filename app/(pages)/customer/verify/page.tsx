"use client";

import FloatingConnect from "@/components/floating-connect";
import VerifyWallet from "@/components/verify-wallet";

const VerifyCustomerWalletPage = () => {
  const handleRequestVerification = () => {};
  const handleSignAndVerify = () => {};
  return (
    <main>
      <FloatingConnect />
      <VerifyWallet
        loading={false}
        onClickRequestVerification={handleRequestVerification}
        onClickSignAndVerify={handleSignAndVerify}
        verificationMessage={[]}
      />
    </main>
  );
};

export default VerifyCustomerWalletPage;
