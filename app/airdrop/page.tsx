"use client";

import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Button } from "@/components/ui/button";
import WalletConnectWrapper from "@/components/wallet-connect-wrapper";
import { useCustomerStore } from "@/store/customerStore";

const AirdropPage = () => {
  const { onChainPoints, customer } = useCustomerStore();

  const handleClaimAirdrop = () => {
    
  };
  return (
    <main className="bg-black min-h-screen text-white">
      <div className="container py-16">
        <div className="p-4">
          <WalletConnectWrapper>
            {onChainPoints ? (
              <div className="text-center">
                <p>You are eligible for the airdrop!</p>
                <p>
                  You have <span className="font-bold">{onChainPoints}</span>{" "}
                  $ELP
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p>
                  You are not eligible for the airdrop. Please redeem your
                  points to be eligible.
                </p>
              </div>
            )}
          </WalletConnectWrapper>
        </div>

        <div className="text-center mt-16 max-w-lg mx-auto">
          {/* allow user to claim airdrop */}
          <BackgroundGradient className="rounded-[22px] bg-black h-full relative overflow-hidden">
            <Button className="w-full" onClick={handleClaimAirdrop}>
              Claim Airdrop
            </Button>
          </BackgroundGradient>
        </div>
      </div>
    </main>
  );
};

export default AirdropPage;
