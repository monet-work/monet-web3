import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type Props = {
  contract?: {
    address: string | undefined | null;
    name: string | undefined | null;
    symbol: string | undefined | null;
  };
  onContractCreateRequested: () => void;
};

const PointContractInfo: React.FC<Props> = ({
  contract,
  onContractCreateRequested,
}) => {
  const { address, name, symbol } = contract ?? {};
  return (
    <div>
      <Card className="sm:col-span-2 w-fit">
        <CardHeader className="pb-3">
          <CardTitle>Your Points Contract</CardTitle>
          <CardDescription className="text-xs leading-relaxed max-w-sm lg:max-w-lg">
            {contract ? (
              <span>
                This is the contract that manages your points. It is unique to
                your account and is used to mint, transfer, and burn points.
              </span>
            ) : (
              <span>
                You do not have a points contract yet. Click the button below to
                create one.
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 w-full h-auto">
          {contract ? (
            <div className="text-xs">
              <div className="flex gap-4">
                <span className="w-[50px]">Address:</span>{" "}
                <span className="font-semibold">
                  <a
                    href={`https://etherscan.io/address/${address}`}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    {/* trim address with ellipsis */}
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </a>
                </span>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex gap-4">
                  <span className="w-[50px]">Name:</span>{" "}
                  <span className="font-semibold">{name}</span>
                </div>
                <div className="flex gap-4">
                  <span className="w-[50px]">Symbol:</span>{" "}
                  <span className="font-semibold">{symbol}</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Button onClick={onContractCreateRequested}>
                Create Points Contract
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PointContractInfo;
