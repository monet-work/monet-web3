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

type Props = {
  onCanceled: () => void;
};

const formSchema = z.object({
  offerType: z.string(),
  point: z.string(),
  paymentToken: z.string(),
  pricePerPoint: z.coerce.number(),
  quantity: z.string(),
  fillType: z.string(),
});

const CreateOfferForm: React.FC<Props> = ({ onCanceled }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: "",
      point: "",
      paymentToken: "",
      pricePerPoint: 0,
      offerType: "sell",
      fillType: "partial",
    },
  });

  const { mutate: sendTransaction, isPending, isError } = useSendTransaction();

  const { marketPlace, setMarketPlace } = useMarketPlaceStore();
  console.log(marketPlace);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const performApproval = async () => {
      const transaction = await prepareContractCall({
        contract: monetPointsContractFactory(values.point),
        method: "approve",
        params: [
          "0x3eb2486F57E6CB3d21C6406a8DbA0D0aCd1613a5",
          BigInt(values.quantity),
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
          BigInt(values.quantity),
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
          <div className="flex flex-col gap-1 items-start">
            <p className="text-sm text-neutral-400">OFFER</p>
            <div className="flex items-center text-xl gap-2">
              {
                marketPlace.find(
                  (item: any) => item.address === form.getValues("point")
                )?.name
              }
              /ETH
              <Image src={"/images/For.svg"} width={26} height={26} alt={""} />
            </div>
            <p className="text-sm font-medium text-green-500 ">
              {/* $
              {2400 *
                form.getValues("pricePerPoint") *
                (form.getValues("quantity") as any)}{" "} */}
              <span className="text-gray-300  text-xs font-normal">
                {(form.getValues("quantity") as any) *
                  form.getValues("pricePerPoint")}{" "}
                ETH
              </span>
            </p>
          </div>
          <div>
            <Button
              className="items-center text-neutral-400 gap-1 "
              variant={"outline"}
            >
              <Info className="w-4 h-4" /> Offer Info
            </Button>
          </div>
        </div>
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="bg-neutral-900 p-4 rounded-lg">
              <FormLabel className="text-base font-medium text-neutral-200">
                Quantity
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-transparent  outline-none  border-none active:outline-none active:border-none  focus:outline-none focus:border-none"
                  placeholder="0"
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
            <FormItem className="bg-neutral-900 p-4 rounded-lg">
              <FormLabel>Select Point</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a POINT" />
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
        <FormField
          control={form.control}
          name="paymentToken"
          disabled={true}
          render={({ field }) => (
            <FormItem className="bg-neutral-900 p-4 text-white rounded-lg">
              <FormLabel>Select Payment Token</FormLabel>
              <Select onValueChange={field.onChange} defaultValue="ETH">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="ETH" />
                  </SelectTrigger>
                </FormControl>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pricePerPoint"
          render={({ field }) => (
            <FormItem className="bg-neutral-900 p-4 rounded-lg">
              <FormLabel className="text-base font-medium text-neutral-200">
                Price Per Point
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-transparent  outline-none  border-none active:outline-none active:border-none  focus:outline-none focus:border-none"
                  placeholder="0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fillType"
          render={({ field }) => (
            <FormItem className="space-y-2 bg-neutral-900 p-4 rounded-lg">
              <FormLabel>Select FillType</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="partial" />
                    </FormControl>
                    <FormLabel className="font-normal">Partial Fill</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="full" />
                    </FormControl>
                    <FormLabel className="font-normal">Full Fill</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 pt-2">
          <Button type="submit" className="w-full">
            Create Offer
          </Button>
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => onCanceled()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateOfferForm;
