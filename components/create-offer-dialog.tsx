import React from "react";
import { AlertDialogContent } from "./ui/alert-dialog";
import BuyOfferComponent from "./buy-offer-component";
import SellOfferComponent from "./sell-offer-component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateOfferForm from "./forms/create-offer-form";

type Props = {};

function CreateOfferDialog({}: Props) {
  const [pricePerPoint, setPricePerPoint] = React.useState(0);
  const [collateral, setCollateral] = React.useState(0);
  const [amount, setAmount] = React.useState(0);
  return (
    <AlertDialogContent>
      <Tabs defaultValue="sell" className="w-full">
        <TabsList className="w-full bg-neutral-900">
          <TabsTrigger value="sell" className="w-full  p-2 text-center">
            <div className=" w-full text-center  ">Sell</div>
          </TabsTrigger>
          <TabsTrigger className="w-full" value="buy">
            <div className=" w-full text-center  ">Buy</div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sell">
          {" "}
          {/* <SellOfferComponent />
           */}
          <CreateOfferForm />
        </TabsContent>
        <TabsContent value="buy">
          <CreateOfferForm />
        </TabsContent>
      </Tabs>
    </AlertDialogContent>
  );
}

export default CreateOfferDialog;
