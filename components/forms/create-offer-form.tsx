import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Form, FormProvider } from "react-hook-form";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";

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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values, "values");
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
          <div className="flex py-4 w-full justify-between">
            <div className="flex flex-col gap-1 items-start">
              <p className="text-sm text-neutral-400">OFFER</p>
              <div className="flex items-center text-xl gap-2">
                HyperLiquid/ETH
                <Image
                  src={"/images/For.svg"}
                  width={26}
                  height={26}
                  alt={""}
                />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                      <FormLabel className="font-normal">
                        Partial Fill
                      </FormLabel>
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
            <Button variant={"secondary"} onClick={() => onCanceled()}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default CreateOfferForm;
