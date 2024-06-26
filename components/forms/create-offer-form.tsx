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
  SelectItem,
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
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import {
  monetMarketplaceContract,
  monetPointsContractFactory,
} from "@/app/contract-utils";
import { toast } from "sonner";
import {
  Address,
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
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { celebratoryConfetti } from "@/lib/confetti-helper";
import { ExternalLink } from "lucide-react";

type Props = {
  onCanceled: () => void;
  onSuccess: (show: boolean, children: JSX.Element) => void;
};

const CreateOfferForm: React.FC<Props> = ({ onCanceled, onSuccess }) => {
  const [isPointDetailPage, setIsPointDetailPage] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  const [decimals, setDecimals] = useState<number>(0);

  const formSchema = z.object({
    offerType: z.string(),
    point: z.string().min(1, "Point is required"),
    pricePerPoint: z.string(),
    amount: z.string().min(1, "Amount is required"),
    fillType: z.string().min(1, "Fill type is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      point: "",
      pricePerPoint: "0",
      offerType: "sell",
      fillType: "partial",
    },
  });

  const point = form.watch("point");
  const amount = form.watch("amount");
  const pricePerPoint = form.watch("pricePerPoint");

  const {
    mutate: sendAndConfirmTransaction,
    data: transactionReceipt,
    isPending,
    isError,
  } = useSendAndConfirmTransaction();

  const { marketPlace } = useMarketPlaceStore();
  const account = useActiveAccount();

  const pathName = usePathname();

  useEffect(() => {
    if (isPointDetailPage && selectedPoint !== "") {
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
      form.setValue("point", pointAddress?.[1]);
      setSelectedPoint(pointAddress?.[1]);

      setIsPointDetailPage(true);
    }
  }, [form, pathName]);

  const totalPriceInEth = BigInt(
    toTokens(
      toUnits(amount, decimals) * toUnits(String(pricePerPoint), 18),
      decimals,
    ),
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const performApproval = async (amount: string) => {
      const transaction = prepareContractCall({
        contract: monetPointsContractFactory(values.point),
        method: "approve",
        params: [
          monetMarketplaceContract.address as Address,
          BigInt(toUnits(amount, decimals)),
        ],
      });

      await sendAndConfirmTransaction(transaction as PreparedTransaction, {
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
      toTokens(toWei(values.pricePerPoint.toString()), decimals),
      values.fillType === "full"
        ? ListingFillType.FULL
        : ListingFillType.PARTIAL,
    ];

    const sellOfferParams = [
      values.point,
      BigInt(toUnits(values.amount, decimals)),
      toTokens(toWei(values.pricePerPoint.toString()), decimals),
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

      await sendAndConfirmTransaction(transaction as PreparedTransaction, {
        onSuccess: (result) => {
          toast.success("Successfully created offer");
          onSuccess(
            true,
            <div>
              <div>
                {"💰💰💰 Offer for " +
                  (values.offerType === "buy" ? "buying " : "selling ") +
                  amount +
                  " " +
                  pointSymbol +
                  " at " +
                  toTokens(totalPriceInEth, 18) +
                  " ETH is created successfully 💰💰💰"}
              </div>
              <div className="text-xs mt-1 text-muted-foreground">
                View your transaction:
                <a
                  href={`https://sepolia.basescan.org/tx/${result.transactionHash}`}
                  target="_blank"
                  className="flex items-center gap-1 hover:underline"
                >
                  {result.transactionHash}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>,
          );
          celebratoryConfetti();
          onCanceled();
        },

        onError: (error) => {
          console.log(error);
          toast.error(
            "Error creating offer. Please make sure you have enough balance",
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
          process.env.NEXT_PUBLIC_MONET_MARKETPLACE_CONTRACT! as Address,
        ],
      });
      return toTokens(data, decimals);
    };

    const allowanceValue = await allowanceFunction();

    if (
      BigInt(allowanceValue) < BigInt(values.amount) &&
      values.offerType === "sell"
    ) {
      await performApproval(values.amount);
    } else {
      await call(); //directly call the function
    }
  };

  const pointSymbol = marketPlace.find(
    (item: any) => item.address === selectedPoint,
  )?.symbol;

  if (marketPlace.length === 0)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    );
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
                Price Per {pointSymbol ? pointSymbol : "Point"} (ETH)
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
                <FormDescription className="text-xs">
                  {!!pricePerPoint && !!point && !!amount
                    ? `Total Price = ${amount} ${pointSymbol} * ${pricePerPoint} (Price Per ${pointSymbol ? pointSymbol : "Point"}) = ${toTokens(totalPriceInEth, 18)} ETH`
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
                  onValueChange={
                    isPointDetailPage
                      ? (value) => {
                          field.onChange(value === "" ? null : null);
                        }
                      : (value) => {
                          field.onChange(value);
                          value && setSelectedPoint(value);
                        }
                  }
                  value={isPointDetailPage ? selectedPoint : field.value}
                  disabled={isPointDetailPage}
                >
                  <FormControl>
                    <SelectTrigger>
                      {isPointDetailPage ? (
                        <SelectValue placeholder={pointSymbol} />
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
                  {isPointDetailPage && selectedPoint !== "" && (
                    <SelectContent>
                      <SelectItem value={selectedPoint}>
                        {
                          marketPlace.find(
                            (item: any) => item.address === selectedPoint,
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
            disabled={!isError && isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full uppercase"
            size={"lg"}
            loading={!isError && isPending}
          >
            Create Offer
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateOfferForm;
