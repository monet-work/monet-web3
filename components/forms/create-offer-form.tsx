"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import {
  monetMarketplaceContract,
  monetPointsContractFactory,
} from "@/app/contract-utils";
import { toast } from "sonner";
import {
  prepareContractCall,
  PreparedTransaction,
  readContract,
  toTokens,
  toUnits,
  toWei,
} from "thirdweb";
import { useMarketPlaceStore } from "@/store/marketPlaceStore";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import {
  ListingFillType,
  ListingType,
  PaymentType,
} from "@/models/asset-listing.model";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const account = useActiveAccount();

  const [isPointDetailPage, setIsPointDetailPage] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string>("");

  const pathName = usePathname();

  useEffect(() => {
    if (pathName === "/marketplace") {
      setIsPointDetailPage(false);
    } else {
      const pointAddress = pathName?.split("-");
      setSelectedPoint(pointAddress?.[1]);
      setIsPointDetailPage(true);
    }
  }, [pathName]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const decimals = await readContract({
      contract: monetPointsContractFactory(values.point),
      method: "decimals",
    });
    const performApproval = async (amount: string) => {
      const transaction = await prepareContractCall({
        contract: monetPointsContractFactory(values.point),
        method: "approve",
        params: [
          monetMarketplaceContract.address,
          BigInt(toUnits(amount, decimals)),
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

    const totalPriceInEth = toUnits(
      String(
        Number(toUnits(values.amount, decimals)) * Number(values.pricePerPoint)
      ),
      18
    );

    console.log(totalPriceInEth, "totalPriceInEth", "params");

    const buyOfferParams = [
      values.point,
      BigInt(toUnits(values.amount, decimals)),
      toWei(values.pricePerPoint.toString()),
      values.fillType === "full"
        ? ListingFillType.FULL
        : ListingFillType.PARTIAL,
    ];

    const sellOfferParams = [
      values.point,
      BigInt(toUnits(values.amount, decimals)),
      toWei(values.pricePerPoint.toString()),
      values.point,
      values.offerType === "buy" ? ListingType.BUY : ListingType.SELL,
      values.fillType === "full"
        ? ListingFillType.FULL
        : ListingFillType.PARTIAL,
      PaymentType.NATIVE_TOKEN,
    ];

    const call = async () => {
      const transaction = await prepareContractCall({
        contract: monetMarketplaceContract,
        method: values.offerType === "buy" ? "createBuyListingNative" : "createListing",
        params: values.offerType === "buy" ? buyOfferParams : sellOfferParams as any,
        value: values.offerType === "buy" ? totalPriceInEth + BigInt(1) : undefined, // change this later
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

    const allowanceFunction = async () => {
      const data = await readContract({
        contract: monetPointsContractFactory(values.point),
        method: "allowance",
        params: [
          account?.address!,
          process.env.NEXT_PUBLIC_MONET_MARKETPLACE_CONTRACT!,
        ],
      });
      console.log(data, "allowance data");
      return toTokens(data, decimals);
    };

    const allowanceValue = await allowanceFunction();
    console.log(
      allowanceValue,
      values.amount,
      Number(allowanceValue) < Number(values.amount)
    );
    if (Number(allowanceValue) < Number(values.amount)) {
      await performApproval(
        (Number(values.amount) - Number(allowanceValue)).toString()
      );
    } else {
      await call(); //directly call the function
    }
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
                  onValueChange={(value) => {
                    value && field.onChange(value);
                  }}
                  className="border rounded"
                >
                  <ToggleGroupItem
                    value="buy"
                    className="w-full uppercase data-[state=on]:text-green-400 data-[state=on]:bg-background data-[state=on]:border data-[state=on]:border-green-400 text-muted-foreground"
                  >
                    Buy Offer
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="sell"
                    className="w-full uppercase data-[state=on]:text-red-400 data-[state=on]:bg-background data-[state=on]:border data-[state=on]:border-red-400 text-muted-foreground"
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
                      {isPointDetailPage ? (
                        <SelectValue
                          placeholder={
                            marketPlace.find(
                              (item: any) => item.address === selectedPoint
                            )?.symbol
                          }
                        />
                      ) : (
                        <SelectValue placeholder="Select a Point" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  {!isPointDetailPage && (
                    <SelectContent>
                      {marketPlace.map((item: any) => (
                        <SelectItem key={item.address} value={item.address}>
                          {item.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                  {isPointDetailPage && (
                    <SelectContent>
                      <SelectItem value={selectedPoint}>
                        {
                          marketPlace.find(
                            (item: any) => item.address === selectedPoint
                          )?.symbol
                        }
                      </SelectItem>
                    </SelectContent>
                  )}
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
          <Button
            type="submit"
            className="w-full uppercase"
            size={"lg"}
            loading={isPending}
          >
            Create Offer
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateOfferForm;
