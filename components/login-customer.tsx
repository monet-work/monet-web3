import Link from "next/link";
import { MonetWorkLogo } from "./icons/monet-work-logo";
import { Button } from "./ui/button";

type Props = {
  onClickConnectWallet: () => void;
};

const LoginCustomer: React.FC<Props> = ({ onClickConnectWallet }) => {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <Link href={"/"}>
              <div className="mt-6 text-2xl font-bold flex items-center text-gray-900 sm:text-3xl md:text-4xl">
                <MonetWorkLogo className="text-blue-600 w-48" /> 🚀
              </div>
            </Link>

            <p className="mt-4 text-2xl leading-relaxed text-gray-500">
              Welcome to the future of loyalty programs!
            </p>

            <div className="col-span-6 mt-4">
              <p className="text-gray-500">
                By connecting your wallet, you can convert your off-chain
                loyalty points to on-chain points. You can use the marketplace
                to trade these points and get benefits of Monet's interoperable
                loyalty rewards ecosystem.
              </p>
            </div>

            <div className="col-span-6 sm:flex sm:items-center sm:gap-4 mt-12">
              <Button
                onClick={onClickConnectWallet}
                className="border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring active:text-blue-500"
              >
                Connect your wallet
              </Button>
              <span className="text-gray-500">or</span>

              <Link href={"/company/login"}>
                <Button className="bg-slate-500 px-12 py-3 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto">
                  Continue as Business
                </Button>
              </Link>
            </div>
            
          </div>
        </main>
      </div>
    </section>
  );
};

export default LoginCustomer;
