import FloatingConnect from "@/components/floating-connect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Spline from "@splinetool/react-spline";

const HomePage = () => {
  return (
    <main>
      <FloatingConnect />
      <section className="bg-background text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <Spline
            scene="https://prod.spline.design/SCXaqhx0ZDC6BNrz/scene.splinecode"
            className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2"
          />
          <div className="mx-auto max-w-3xl text-center z-50">
            <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-5xl font-extrabold text-transparent">
              Revolutionizing Loyalty with
              <span className="sm:block"> Decentralized Rewards. </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm font-light text-muted-foreground">
              Monet is a decentralized platform for businesses to manage
              blockchain-based loyalty programs, where customers can earn,
              redeem, and trade points.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={"/company/login"}>
                <Button className="bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-purple-600 hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto">
                  Continue as Business
                </Button>
              </Link>

              <Link href={"/customer/login"}>
                <Button className="bg-slate-500 px-12 py-3 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto">
                  Continue as Customer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
