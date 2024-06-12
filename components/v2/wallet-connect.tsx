import { useEffect, useState } from "react";
import {
  AutoConnect,
  useActiveAccount,
  useConnect,
  useSetActiveWallet,
} from "thirdweb/react";
import { Button } from "../ui/button";
import { client, connectWallet } from "@/app/thirdweb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { createWallet } from "thirdweb/wallets";

const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const activeAccount = useActiveAccount();
  const { connect, isConnecting, error } = useConnect();
  const setActiveAccount = useSetActiveWallet();

  const wallets = [createWallet("io.metamask")];

  useEffect(() => {
    console.log(activeAccount, "active account");
    if (activeAccount) {
    }
  }, [activeAccount]);

  const handleConnect = async () => {
    await connectWallet(connect);
  };

  return (
    <div className="text-white">
      <AutoConnect client={client} timeout={10000} wallets={wallets} />
      {activeAccount ? (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>{activeAccount?.address}</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div>
          <Button onClick={handleConnect} loading={isConnecting}>
            Connect Wallet
          </Button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
