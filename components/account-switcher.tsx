import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AccountSwitcher = () => {
  return (
    <div className="bg-background/80 w-full fixed h-full backdrop-blur-sm flex justify-center items-center">
      <Card className="backdrop-blur-sm bg-muted-foreground/20 relative">
        <div className="p-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Wallet Change Detected!</h1>
            <p className="text-sm mt-2 max-w-sm text-muted-foreground">
              We have detected a wallet change. Please verify your wallet to
              continue.
            </p>

            <div>
              <div className="mt-8 flex flex-col justify-center gap-4">
                <Link href={"/company/login"}>
                  <Button className="bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-purple-600 hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-full">
                    Continue as Business
                  </Button>
                </Link>

                <Link href={"/customer/login"}>
                  <Button className="bg-slate-500 px-12 py-3 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-full">
                    Continue as Customer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AccountSwitcher;
