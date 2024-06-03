import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Form, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertDialogCancel } from "../ui/alert-dialog";
import { Info } from "lucide-react";

type Props = {};

const formSchema = z.object({
  offerType: z.string(),
  pricePerPoint: z.coerce.number(),
  quantity: z.string(),
  fillType: z.string(),
});

const CreateOfferForm: React.FC<Props> = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: "",
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
                    className="bg-transparent  outline-none my-1 border-none active:outline-none active:border-none text-lg focus:outline-none focus:border-none"
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
            name="pricePerPoint"
            render={({ field }) => (
              <FormItem className="bg-neutral-900 p-4 rounded-lg">
                <FormLabel className="text-base font-medium text-neutral-200">
                  Price Per Point
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-transparent  outline-none my-1 border-none active:outline-none active:border-none text-lg focus:outline-none focus:border-none"
                    placeholder="0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2 pt-2">
            <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
            <Button type="submit" className="w-full">
              Create Offer
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default CreateOfferForm;
