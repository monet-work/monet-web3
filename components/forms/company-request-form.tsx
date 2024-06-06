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
  words: string;
  isRegistered: boolean;
  onSubmitForm: (values: z.infer<ReturnType<typeof getFormSchema>>) => void;
  loading?: boolean;
};

const getFormSchema = (isRegistered: boolean) => {
  return z.object({
    name: isRegistered
      ? z.string().min(3).optional()
      : z.string().min(3, {
          message: "Name must be at least 3 characters",
        }),
    email: isRegistered
      ? z.string().email().optional()
      : z.string().email({
          message: "Please enter a valid email",
        }),
    pointName: isRegistered ? z.string().min(3).optional() : z.string().min(3),
    pointSymbol: isRegistered
      ? z.string().min(3).optional()
      : z.string().min(3),
    decimal: isRegistered ? z.string().min(1).optional() : z.string().min(1),
    description: isRegistered
      ? z.string().min(3).optional()
      : z.string().min(3),
  });
};

const verifySignatureMessage = `To verify your wallet, we have generated a set of words.
You will notice these words when you sign using your
wallet. Once your signature is validated, your request
will be submitted.`;

const CompanyRequestForm: React.FC<Props> = ({
  onSubmitForm,
  loading,
  words,
  isRegistered,
}) => {
  const formSchema = getFormSchema(isRegistered);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      pointName: "",
      pointSymbol: "",
      description: "",
      decimal: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("submit", values);
    onSubmitForm(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {!isRegistered && (
          <>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter company description"
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
              <FormField
                control={form.control}
                name="decimal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decimal</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter decimals"
                        {...field}
                        className="bg-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        <div>
          <p className="text-muted-foreground text-sm">
            {verifySignatureMessage}
          </p>
          <div className="flex items-center py-4">
            <div className="text-lg font-semibold mx-2 p-2 border border-slate-200 rounded">
              {words}
            </div>
          </div>
        </div>

        {isRegistered ? (
          <Button
            type="button"
            loading={loading}
            onClick={() => onSubmitForm({})}
          >
            Submit Request and Verify Wallet
          </Button>
        ) : (
          <Button type="submit" loading={loading}>
            Submit Request and Verify Wallet
          </Button>
        )}
      </form>
    </Form>
  );
};

export default CompanyRequestForm;
