"use client";

import { useActiveAccount, useConnect } from "thirdweb/react";
import { CardContainer, CardBody, CardItem } from "../ui/3d-card";
import { Button } from "../ui/button";
import { connectWallet } from "@/app/thirdweb";
import VerifyWallet from "./verify-wallet";
import useCompanyAuth from "@/hooks/useCompanyAuth";

const videoUrl = "/videos/hero-bg.mp4";

const Hero = () => {
  const { connect, isConnecting, error } = useConnect();
  const { loading: isLoadingAuth } = useCompanyAuth();
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;

  const isWalletConnected = !!walletAddress;

  const handleConnect = async () => {
    await connectWallet(connect);
  };

  return (
    <section className="min-h-screen bg-background relative py-16">
      <video
        loop
        muted
        autoPlay
        className="absolute max-w-none w-screen object-cover top-0 left-0 h-full opacity-20"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      <div className="absolute top-0 w-full h-full bg-gradient-to-b from-black to-transparent"></div>
      {!isWalletConnected && (
        <CardContainer className="inter-var w-full text-center lll">
          <CardBody className="bg-transparent relative w-2/3">
            <CardItem className="text-xl font-bold text-typography-white w-full z-20">
              <h1 className="text-4xl md:6xl lg:text-7xl relative">
                Loyalty points meets <span>blockchain</span>
              </h1>

              <Button
                className="mt-8 bg-accent hover:bg-accent-dark text-lg h-12"
                onClick={handleConnect}
                loading={isConnecting}
              >
                Get started with your wallet
              </Button>
            </CardItem>
          </CardBody>
        </CardContainer>
      )}

      {isWalletConnected && !isLoadingAuth && (
        <div className="absolute z-10 top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2">
          <VerifyWallet />
        </div>
      )}
    </section>
  );
};

export default Hero;
