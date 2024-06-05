import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { useSendTransaction } from "thirdweb/react";
import {
  monetMarketplaceContract,
  monetPointsContractFactory,
} from "@/app/contract-utils";
import { toast } from "sonner";
import { prepareContractCall, PreparedTransaction, toWei } from "thirdweb";
import { useMarketPlaceStore } from "@/store/marketPlaceStore";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type Props = {
  onCanceled: () => void;
};

const formSchema = z.object({
  offerType: z.string(),
  point: z.string(),
  // paymentToken: z.string(),
  pricePerPoint: z.coerce.number(),
  amount: z.string(),
  fillType: z.string(),
});

const CreateOfferForm: React.FC<Props> = ({ onCanceled }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      point: "",
      // paymentToken: "",
      pricePerPoint: 0,
      offerType: "sell",
      fillType: "partial",
    },
  });

  const { mutate: sendTransaction, isPending, isError } = useSendTransaction();

  const { marketPlace, setMarketPlace } = useMarketPlaceStore();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const performApproval = async () => {
      const transaction = await prepareContractCall({
        contract: monetPointsContractFactory(values.point),
        method: "approve",
        params: [
          "0x3eb2486F57E6CB3d21C6406a8DbA0D0aCd1613a5",
          BigInt(values.amount),
        ],
      });
      await sendTransaction(transaction as PreparedTransaction, {
        onSuccess: async () => {
          console.log("Approved");
          await call();
        },
        onError: () => {
          console.log("Error approving");
        },
      });
    };

    console.log("submit", values);
    const call = async () => {
      const transaction = await prepareContractCall({
        contract: monetMarketplaceContract,
        method: "createListing",
        params: [
          values.point,
          BigInt(values.amount),
          toWei(values.pricePerPoint.toString()),
          values.point,
          1,
          values.fillType === "full" ? 1 : 0,
          0,
        ],
      });

      await sendTransaction(transaction as PreparedTransaction, {
        onSuccess: (result) => {
          toast.success("Successfully created offer");

          onCanceled();
        },

        onError: (error) => {
          console.log(error);
          toast.error(error.message);
        },
      });
    };

    performApproval();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
        <div className="flex py-4 w-full justify-between">
          <Label className="text-2xl uppercase font-light">Create Offer</Label>
        </div>
        <FormField
          control={form.control}
          name="offerType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={field.onChange}
                  className="border rounded"
                >
                  <ToggleGroupItem
                    value="buy"
                    className="w-full uppercase text-green-600"
                  >
                    Buy Offer
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="sell"
                    className="w-full uppercase text-red-600"
                  >
                    Sell Offer
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="pricePerPoint"
          render={({ field }) => (
            <FormItem className="p-4 rounded-lg">
              <FormLabel className="text-xs text-muted-foreground uppercase">
                Price Per Point (ETH)
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-transparent  outline-none  border-none active:outline-none active:border-none  focus:outline-none focus:border-none"
                  placeholder="Enter your price"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className=" p-4 rounded-lg">
                <FormLabel className="text-xs font-medium text-muted-foreground uppercase">
                  Amount
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-transparent  outline-none  border-none active:outline-none active:border-none  focus:outline-none focus:border-none"
                    placeholder="Enter Amount"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="point"
            render={({ field }) => (
              <FormItem className="p-4 rounded-lg">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Point" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {marketPlace.map((item: any) => (
                      <SelectItem key={item.address} value={item.address}>
                        {item.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between items-center">
          <FormField
            control={form.control}
            name="fillType"
            render={({ field }) => (
              <FormItem className="space-y-2 p-4 rounded-lg">
                <FormLabel className="text-xs text-muted-foreground uppercase">
                  Select Fill Type
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="partial" />
                      </FormControl>
                      <FormLabel className="font-light">Partial Fill</FormLabel>
                    </FormItem>
                    <FormDescription className="text-xs">
                      Allows you to sell a portion of your offer
                    </FormDescription>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="full" />
                      </FormControl>
                      <FormLabel className="font-light">Full Fill</FormLabel>
                    </FormItem>
                    <FormDescription className="text-xs">
                      Allows you to sell the entire offer
                    </FormDescription>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem className="p-4  rounded-lg">
            <FormLabel className="text-xs text-muted-foreground uppercase">
              Payment Token
            </FormLabel>
            <Select defaultValue="ETH">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="ETH" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="ETH">ETH</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => onCanceled()}
            className="uppercase w-full"
            size={"lg"}
          >
            Cancel
          </Button>
          <Button type="submit" className="w-full uppercase" size={"lg"}>
            Create Offer
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateOfferForm;
