import Link from "next/link";
import { MonetWorkLogo } from "./icons/monet-work-logo";
import { Button } from "./ui/button";
import FloatingConnect from "./floating-connect";

type Props = {
  onClickConnectWallet: () => void;
  loading?: boolean;
};

const LoginAdmin: React.FC<Props> = ({
  onClickConnectWallet,
  loading = false,
}) => {
  return (
    <section className="bg-background">
      <FloatingConnect />
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-first lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1557411732-1797a9171fcf?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <Link href={"/"}>
              <div className="mt-6 text-2xl font-bold flex items-center text-gray-900 sm:text-3xl md:text-4xl">
                <MonetWorkLogo className="text-primary w-48" /> 🚀
                <span className="text-muted-foreground ml-4">Admin Login</span>
              </div>
            </Link>

            <p className="mt-4 text-2xl leading-relaxed text-foreground">
              Welcome to the future of loyalty programs!
            </p>

            <div className="col-span-6 mt-4">
              <p className="text-muted-foreground">
                {` By connecting your wallet, you can convert your off-chain
                loyalty points to on-chain points. You can use the marketplace
                to trade these points and get benefits of Monet's interoperable
                loyalty rewards ecosystem.`}
              </p>
            </div>

            <div className="col-span-6 flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-center sm:gap-4 mt-12">
              <Button
                loading={loading}
                onClick={onClickConnectWallet}
                className="border-primary px-12 py-3 text-sm font-medium transition focus:outline-none focus:ring active:text-blue-500"
              >
                Connect your wallet
              </Button>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default LoginAdmin;
