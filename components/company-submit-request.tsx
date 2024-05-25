"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CompanyRequestForm from "@/components/forms/company-request-form";

type Props = {
  loading: boolean;
  onClickSubmitRequest: (values: {
    name: string;
    email: string;
    pointName: string;
    pointSymbol: string;
    description: string;
  }) => void;
  verificationMessage: string;
};

const verfiySignatureMessage = `To verify your wallet, we have generated a set of words.
You will notice these words when you sign using your
wallet. Once your signature is validated, your request
will be submitted.`;

const CompanySubmitRequest: React.FC<Props> = ({
  loading,
  verificationMessage,
  onClickSubmitRequest,
}) => {
  return (
    <section className="bg-background">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1507214617719-4a3daf41b9ac?q=80&w=2924&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <Card className="backdrop-blur-sm bg-muted-foreground/20 relative">
              <div className="p-4">
                <CardHeader>
                  <CardTitle>Submit Points Contract Request</CardTitle>

                  <CardDescription>
                    <p>
                      To submit a request to create a new points contract, fill
                      out the form below and verify your wallet with the message
                      provided.
                    </p>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <CompanyRequestForm
                    words={verificationMessage}
                    onSubmitForm={(values) => {
                      onClickSubmitRequest(values);
                    }}
                  />
                </CardContent>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </section>
  );
};

export default CompanySubmitRequest;
