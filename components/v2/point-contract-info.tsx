import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

type Props = {
  address: string;
  name: string;
  symbol: string;
};

const PointContractInfo: React.FC<Props> = ({ address, name, symbol }) => {
  return (
    <div>
      <Card className="sm:col-span-2 w-fit">
        <CardHeader className="pb-3">
          <CardTitle>Your Points Smart Contract</CardTitle>
          <CardDescription className="text-balance leading-relaxed max-w-sm lg:max-w-lg">
            Your points smart contract has been created successfully. You can
            use the contract address below to interact with your points
            contract.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 w-full h-auto">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap">
              <span className="font-bold w-1/4">Contract Address:</span>
              <span className="text-xs md:text-base">{address}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold w-1/4">Point Name:</span>
              <span>{name}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold w-1/4">Point Symbol:</span>
              <span>{symbol}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PointContractInfo;
