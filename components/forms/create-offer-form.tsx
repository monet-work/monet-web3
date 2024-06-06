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
  const [isPointDetailPage, setIsPointDetailPage] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  const [decimals, setDecimals] = useState<number>(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      point: isPointDetailPage ? selectedPoint : "",
      // paymentToken: "",
      pricePerPoint: 0,
      offerType: "sell",
      fillType: "partial",
    },
  });

  const point = form.watch("point");
  const amount = form.watch("amount");
  const pricePerPoint = form.watch("pricePerPoint");

  const { mutate: sendTransaction, isPending, isError } = useSendTransaction();

  const { marketPlace, setMarketPlace } = useMarketPlaceStore();
  const account = useActiveAccount();

  const pathName = usePathname();

  useEffect(() => {
    if (isPointDetailPage) {
      form.setValue("point", selectedPoint);
    }
  }, [isPointDetailPage, selectedPoint, form]);

  useEffect(() => {
    if (!point) return;
    const fetchDecimals = async () => {
      const decimals = await readContract({
        contract: monetPointsContractFactory(point),
        method: "decimals",
      });
      setDecimals(Number(decimals));
    };

    fetchDecimals();
  }, [point]);

  useEffect(() => {
    if (pathName === "/marketplace") {
      setIsPointDetailPage(false);
    } else {
      const pointAddress = pathName?.split("-");
      setSelectedPoint(pointAddress?.[1]);
      setIsPointDetailPage(true);
    }
  }, [pathName]);

  const totalPriceInEth = toUnits(
    String(Number(toUnits(amount, decimals)) * Number(pricePerPoint)),
    18
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
          toast.success("Successfully approved");
          await call();
        },
        onError: () => {
          toast.error("Error approving");
        },
      });
    };

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
        method:
          values.offerType === "buy"
            ? "createBuyListingNative"
            : "createListing",
        params:
          values.offerType === "buy"
            ? buyOfferParams
            : (sellOfferParams as any),
        value:
          values.offerType === "buy" ? totalPriceInEth + BigInt(1) : undefined, // change this later
      });

      await sendTransaction(transaction as PreparedTransaction, {
        onSuccess: (result) => {
          toast.success("Successfully created offer");

          onCanceled();
        },

        onError: (error) => {
          console.log(error);
          toast.error(
            "Error creating offer. Please make sure you have enough balance"
          );
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
      return toTokens(data, decimals);
    };

    const allowanceValue = await allowanceFunction();

    if (Number(allowanceValue) < Number(values.amount)) {
      await performApproval(
        (Number(values.amount) - Number(allowanceValue)).toString()
      );
    } else {
      await call(); //directly call the function
    }
  };

  const pointSymbol = marketPlace.find(
    (item: any) => item.address === selectedPoint
  )?.symbol;

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
              <FormDescription className="text-xs">
                {!!pricePerPoint && !!point
                  ? `1 Point = ${toUnits("1", decimals)} ${pointSymbol}`
                  : ""}
              </FormDescription>
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
                <FormDescription className="text-xs">
                  {!!pricePerPoint && !!point && !!amount
                    ? `Total Price: ${toTokens(totalPriceInEth, 18)} ETH`
                    : ""}
                </FormDescription>
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
                  onValueChange={isPointDetailPage ? () => {} : field.onChange}
                  value={isPointDetailPage ? selectedPoint : field.value}
                  disabled={isPointDetailPage}
                >
                  <FormControl>
                    <SelectTrigger>
                      {isPointDetailPage ? (
                        <SelectValue>{pointSymbol}</SelectValue>
                      ) : (
                        <SelectValue placeholder="Select a point" />
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
