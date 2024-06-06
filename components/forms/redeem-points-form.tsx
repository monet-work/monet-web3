"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Coins } from "lucide-react";

type Props = {
  isLoading?: boolean;
  totalPoints: number;
  onSubmitForm: (values: z.infer<typeof formSchema>) => void;
  onChainPoints: number;
};

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
});

const RedeemPointsForm: React.FC<Props> = ({
  totalPoints,
  onSubmitForm,
  onChainPoints,
  isLoading,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmitForm(values);
  };

  const amount = form.watch("amount");

  return (
    <div className="p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder="How many points do you want to redeem?"
                    {...field}
                    className="placeholder:text-xs bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-muted-foreground space-y-2">
            {isLoading || !totalPoints ? (
              <Skeleton className="w-full h-16" />
            ) : (
              <div className="text-xs space-y-2">
                <div className="flex items-center">
                  <Coins className="mr-2 text-yellow-500" size={16} />
                  <div className="flex justify-between w-full"><span>Total points available:</span> <span>{totalPoints}</span></div>
                </div>
                <div className="flex items-center">
                  <Coins className="mr-2 text-yellow-500" size={16} />
                  <div className="flex justify-between w-full"><span>Total points on chain:</span> <span>{onChainPoints}</span></div>
                </div>
                <div className="flex items-center text-white">
                  <Coins className="mr-2 text-yellow-500" size={16} />
                  <div className="flex justify-between w-full"><span>Redeemable points:</span> <span>{totalPoints - onChainPoints}</span></div>
                </div>
              </div>
            )}
          </div>
          <Button
            type="submit"
            size={'lg'}
            disabled={
              !amount ||
              totalPoints < Number(amount) ||
              Number(totalPoints) - onChainPoints < Number(amount)
            }
            className="w-full"
          >
            Redeem {Number(amount) > 0 ? amount : ""} points
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RedeemPointsForm;
