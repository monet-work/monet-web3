import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Siren } from "lucide-react";
import Image from "next/image";
const MetaMaskDownloader = ({
  setLoginRequested,
}: {
  setLoginRequested: any;
}) => {
  return (
    <div className="bg-background/80 w-full fixed h-full backdrop-blur-sm z-50 flex justify-center items-center">
      <Card className="backdrop-blur-sm bg-muted-foreground/20 relative">
        <div className="p-4">
          <div className="flex flex-col">
            <h1 className="text-2xl items-center gap-2 flex font-bold">
              Metamask wallet not detected 🚨
            </h1>
            <p className="text-sm mt-2 max-w-sm text-muted-foreground">
              Please make sure your wallet is unlocked and available. If you do
              not currently have a Web3 wallet, we suggest{" "}
              <span className="font-semibold">
                {" "}
                <a
                  className="text-blue-500"
                  target="_blank"
                  href="https://metamask.io/"
                >
                  {" "}
                  Metamask
                </a>
              </span>
            </p>

            <div>
              <div className="mt-8 flex flex-col justify-center gap-4">
                <a href="https://metamask.io/download" target="_blank">
                  <Button className="bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-purple-600 hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-full">
                    Install&nbsp;
                    <span className="font-semibold">Metamask Wallet</span>
                    <Image
                      src={"/images/svgs/metamask-icon.svg"}
                      width={20}
                      className="mx-2"
                      height={20}
                      alt="Metamask Icon"
                    />
                  </Button>
                </a>
                <Button
                  onClick={() => setLoginRequested(false)}
                  variant={"outline"}
                  className=" px-12 py-3 text-sm font-medium bg-neutral-500 text-white hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-full"
                >
                  Cancel 😥
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MetaMaskDownloader;
