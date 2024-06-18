import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { baseSepolia, sepolia } from "thirdweb/chains";

const ChainSwitcher = ({
  setActiveChainChanged,
}: {
  setActiveChainChanged: (value: boolean) => void;
}) => {
  const switchChain = useSwitchActiveWalletChain();
  return (
    <div className="bg-background/80 w-full fixed h-full backdrop-blur-sm flex justify-center items-center">
      <Card className="backdrop-blur-sm bg-muted-foreground/20 relative">
        <div className="p-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Different Chain Detected!</h1>
            <p className="text-sm mt-2 max-w-sm text-muted-foreground">
              We have detected you are using a different chain. Please switch to
              BaseSepolia to continue.
            </p>

            <div>
              <div className="mt-8 flex flex-col justify-center gap-4">
                <Button
                  onClick={() =>
                    switchChain(baseSepolia).then(() =>
                      setActiveChainChanged(true)
                    )
                  }
                  className="bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-purple-600 hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-full"
                >
                  Switch to Base Sepolia
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChainSwitcher;
