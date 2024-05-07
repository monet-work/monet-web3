import { CardBody } from "../ui/3d-card";
import { Button } from "../ui/button";
import {
  Card,
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
      <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-3">
          <CardTitle>Your Points Smart Contract</CardTitle>
          <CardDescription className="text-balance leading-relaxed">
            Your points smart contract has been created successfully. You can
            use the contract address below to interact with your points
            contract.
          </CardDescription>
        </CardHeader>
        <CardBody className="px-6 w-full">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <span className="font-bold w-1/4">Contract Address:</span>
              <span>{address}</span>
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
        </CardBody>
        <CardFooter>
          <Button>Upload user points data</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PointContractInfo;
