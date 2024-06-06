"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";

type Props = {
  loading: boolean;
  onClickSubmitRequest: () => void;
  verificationMessage: string;
};

const AdminSubmitRequest: React.FC<Props> = ({
  loading,
  verificationMessage,
  onClickSubmitRequest,
}) => {
  const verfiySignatureMessage = `To verify your wallet, we have generated a set of words.
You will notice these words when you sign using your
wallet. Once your signature is validated, your request
will be submitted.`;
  return (
    <section className="bg-background">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-first lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src={"/images/svgs/abstract-background-swell-waves.svg"}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <Card className="backdrop-blur-sm bg-muted-foreground/20 relative">
              <div className="p-4">
                <CardHeader>
                  <CardTitle>Submit Points Contract Request</CardTitle>

                  <CardDescription className="">
                    To submit a request to create a new points contract, fill
                    out the form below and verify your wallet with the message
                    provided.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {verfiySignatureMessage}
                    </p>
                    <div className="flex items-center py-4">
                      <div className="text-lg font-semibold mx-2 p-2 border border-slate-200 rounded">
                        {verificationMessage}
                      </div>
                    </div>
                  </div>
                  <Button onClick={onClickSubmitRequest} loading={loading}>
                    Submit Request and Verify Wallet
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </section>
  );
};

export default AdminSubmitRequest;
