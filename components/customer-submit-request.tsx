"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/store/userStore";
import CustomerRequestForm from "./forms/customer-request-form";
import Spline from "@splinetool/react-spline";

type FormValues = {
  name: string;
  email: string;
  pointName: string;
  pointSymbol: string;
  description: string;
};

type Props = {
  loading: boolean;
  onClickSubmitRequest: (value: Partial<FormValues>) => void;
  verificationMessage: string;
};

const CustomerSubmitRequest: React.FC<Props> = ({
  loading,
  verificationMessage,
  onClickSubmitRequest,
}) => {
  const userStore = useUserStore();
  return (
    <section className="bg-background">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-first lg:col-span-5 lg:h-full xl:col-span-6">
          <Spline scene="https://prod.spline.design/mbdk1wtIgdMhoDBC/scene.splinecode" />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <Card className="backdrop-blur-sm bg-muted-foreground/20 relative">
              <div className="p-4">
                <CardHeader>
                  <CardTitle>
                    {userStore.isRegistered
                      ? "Complete Registration"
                      : "Verify Wallet"}
                  </CardTitle>

                  <CardDescription className="">
                    {!userStore.isRegistered
                      ? `To complete your registration, fill
                    out the form below and verify your wallet with the message
                    provided.`
                      : "Verify your wallet using signature."}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <CustomerRequestForm
                    words={verificationMessage}
                    loading={loading}
                    isRegistered={userStore.isRegistered}
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

export default CustomerSubmitRequest;
