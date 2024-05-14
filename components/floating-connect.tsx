"use client";

import { client } from "@/app/thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const FloatingConnect = () => {
  const activeAccount = useActiveAccount();
  return (
    <>
      {activeAccount ? (
        <div className="flex gap-4 items-center fixed top-0 right-0 m-4 z-50">
          <ConnectButton
            client={client}
            connectButton={{
              style: {
                padding: "0.5rem 1rem",
                position: "fixed",
                top: 0,
                right: 0,
                margin: "1rem",
              },
            }}
            wallets={[createWallet("io.metamask")]}
          />
        </div>
      ) : null}
    </>
  );
};

export default FloatingConnect;
