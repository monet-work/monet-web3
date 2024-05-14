'use client';

import VerifyWallet from "@/components/verfiy-wallet";

const VerifyCustomerWalletPage = () => {
  const handleRequestVerification = () => {};
  const handleSignAndVerify = () => {};
  return (
    <main>
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
