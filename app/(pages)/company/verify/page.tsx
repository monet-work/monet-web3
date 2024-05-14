'use client';

import VerifyWallet from "@/components/verfiy-wallet";

const VerifyConpanyWalletPage = () => {
  const handleRequestVerification = () => {};
  const handleSignAndVerify = () => {};
  return (
    <main>
      <main>
        <VerifyWallet
          loading={false}
          onClickRequestVerification={handleRequestVerification}
          onClickSignAndVerify={handleSignAndVerify}
          verificationMessage={[]}
        />
      </main>
    </main>
  );
};

export default VerifyConpanyWalletPage;
