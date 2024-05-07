"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Props = {
  onSubmitForm: (values: z.infer<typeof formSchema>) => void;
  loading?: boolean;
};

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  pointName: z.string().min(3),
  pointSymbol: z.string().min(3),
  orderingFee: z.string().min(1),
  decimalDigits: z.string().min(1),
  points: z.string().min(1),
});

const CompanyRequestForm: React.FC<Props> = ({ onSubmitForm, loading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      pointName: "",
      pointSymbol: "",
      orderingFee: "",
      decimalDigits: "",
      points: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmitForm(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Company Name"
                  {...field}
                  className="bg-transparent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter company email"
                  {...field}
                  type="email"
                  className="bg-transparent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="points"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter total points in circulation"
                  {...field}
                  className="bg-transparent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="pointName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Point Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Point Name"
                    {...field}
                    className="bg-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pointSymbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Point Symbol</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Point Symbol"
                    {...field}
                    className="bg-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="orderingFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ordering Fee</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Ordering Fee"
                    {...field}
                    className="bg-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="decimalDigits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Decimal Digits</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Decimal Digits"
                    {...field}
                    className="bg-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" loading={loading}>
          Submit Request
        </Button>
      </form>
    </Form>
  );
};

export default CompanyRequestForm;
