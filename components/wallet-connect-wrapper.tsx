import { useActiveAccount } from "thirdweb/react";

type Props = {
  children?: React.ReactNode;
};

const WalletConnectWrapper: React.FC<Props> = ({ children }) => {
  const account = useActiveAccount();
  const walletAddress = account?.address;
  // request user to connect wallet if wallet address is not found. Show a message to connect wallet
  // if wallet is connected then show the children
  if (!walletAddress) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="text-center">
          <p>Connect your wallet to continue</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default WalletConnectWrapper;
