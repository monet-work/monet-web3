"use client";

import { WalletIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

type Props = {
  onClickConnect: () => void;
  isConnecting: boolean;
};

const ConnectWallet: React.FC<Props> = ({ onClickConnect, isConnecting = false }) => {
  const onClickConnectWallet = () => {
    onClickConnect();
  };

  return (
    <Card className="p-6">
      <CardContent className="py-4">
        <div className="flex justify-center text-center">
          <Button onClick={onClickConnectWallet} loading={isConnecting}>
            <WalletIcon className="mr-2 h-4 w-4" /> Connect your wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectWallet;
