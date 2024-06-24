import { cn, ellipsis } from "@/lib/utils";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Coins, ExternalLink, Gift } from "lucide-react";

type Props = {
  className?: string;
  pointName: string;
  pointSymbol: string;
  pointAddress: string;
  offChain: BigInt;
  onChain: BigInt;
  onRedeemClick: () => void;
};

const PointCard: React.FC<Props> = ({
  className,
  pointName = "",
  pointSymbol = "",
  pointAddress = "",
  offChain = 0,
  onChain = 0,
  onRedeemClick,
}) => {
  return (
    <Card className={cn(className, "hover:bg-muted transition-all")}>
      <div className="p-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{pointName}</h1>
          <p className="text-sm mt-2 max-w-sm text-muted-foreground">
            ({pointSymbol})
          </p>
          <p className="text-xs mt-2 max-w-sm text-muted-foreground hover:underline flex items-center">
            <ExternalLink className="mr-2" size={16} />
            <span>
              Address:{" "}
              <a href={`https://sepolia.basescan.org/address/${pointAddress}`}>
                {ellipsis(pointAddress, 10)}
              </a>
            </span>
          </p>
          <div className="text-sm max-w-sm text-muted-foreground flex items-center mt-4">
            <Coins className="mr-2 text-yellow-500" size={16} />
            Off Chain: {offChain.toString()}
          </div>
          <div className="text-sm mt-2 max-w-sm text-muted-foreground flex items-center">
            <Coins className="mr-2 text-yellow-500" size={16} />
            On Chain: {onChain.toString()}
          </div>
          <Button
            onClick={onRedeemClick}
            className="w-full mt-8 rounded-lg p-2 bg-transparent border border-muted text-muted-foreground hover:text-muted"
          >
            <Gift className="mr-2" size={16} />
            Redeem
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PointCard;
