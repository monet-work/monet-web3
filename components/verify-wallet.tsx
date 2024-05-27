'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  onClickRequestVerification: () => void;
  loading: boolean;
};

const VerifyWallet: React.FC<Props> = ({
  onClickRequestVerification,
  loading = false,
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
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold">Verify Wallet</h1>
                  <p className="text-sm mt-2 max-w-sm text-muted-foreground">
                    We need to verify your wallet to provide you with access to
                    our platform. Please click the button below to verify your
                    wallet.
                  </p>

                  <Button
                    onClick={onClickRequestVerification}
                    loading={loading}
                    className="w-full mt-16"
                  >
                    Verify Wallet
                  </Button>
                </div>

                
              </div>
            </Card>
          </div>
        </main>
      </div>
    </section>
  );
};

export default VerifyWallet;
