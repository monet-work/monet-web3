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
import { monetMarketplaceContract } from "@/app/contract-utils";
import { toast } from "sonner";
import { prepareContractCall, PreparedTransaction } from "thirdweb";

type Props = {
  onCanceled: () => void;
};

const formSchema = z.object({
  offerType: z.string(),
  point: z.string(),
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
      pricePerPoint: 0,
      offerType: "sell",
      fillType: "partial",
    },
  });

  const { mutate: sendTransaction, isPending, isError } = useSendTransaction();
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("submit", values);
    const call = async () => {
      const transaction = await prepareContractCall({
        contract: monetMarketplaceContract,
        method: "createListing",
        params: [
          "0x08Bb7B2b3f3aE90DB61d515A6FE0954aE24d9212",
          BigInt(values.quantity),
          BigInt(values.pricePerPoint),
          "0x08Bb7B2b3f3aE90DB61d515A6FE0954aE24d9212",
          1,
          1,
          1,
        ],
      });

      await sendTransaction(transaction as PreparedTransaction, {
        onSuccess: (result) => {
          toast.success("Successfully created offer");
        },

        onError: (error) => {
          toast.error(error.message);
        },
      });
    };

    call();
  };

  const Sellcall = async () => {
    const transaction = await prepareContractCall({
      contract: monetMarketplaceContract,
      method: "createListing",
      params: [
        "0xd263Fa230cCfa39FaE3A783f2f874ddD3f1294D3",
        BigInt(10000),
        BigInt(2),
        "0xd263Fa230cCfa39FaE3A783f2f874ddD3f1294D3",
        1,
        1,
        1,
      ],
    });

    await sendTransaction(transaction as PreparedTransaction, {
      onSuccess: (result) => {
        toast.success("Successfully created offer");
      },

      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
        <div className="flex py-4 w-full justify-between">
          <div className="flex flex-col gap-1 items-start">
            <p className="text-sm text-neutral-400">OFFER</p>
            <div className="flex items-center text-xl gap-2">
              HyperLiquid/ETH
              <Image src={"/images/For.svg"} width={26} height={26} alt={""} />
            </div>
            <p className="text-sm font-medium text-green-500 ">
              $5.45{" "}
              <span className="text-gray-300  text-xs font-normal">
                0.000145 ETH
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
                  <SelectItem value="ADB">ADB</SelectItem>
                  <SelectItem value="TSTP">TSTP</SelectItem>
                  <SelectItem value="NRG">NRG</SelectItem>
                </SelectContent>
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
                      <RadioGroupItem value="Partial" />
                    </FormControl>
                    <FormLabel className="font-normal">Partial Fill</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Full" />
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
