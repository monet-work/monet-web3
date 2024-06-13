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
            className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-40"
          />
          <div className="mx-auto max-w-3xl text-center z-50">
            <h1 className="bg-gradient-to-r from-yellow-200 via-yellow-600 to-yellow-400 bg-clip-text text-5xl font-extrabold text-transparent">
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
                <Button className="bg-accent px-12 py-3 text-sm font-medium text-white hover:bg-primary hover:text-muted focus:outline-none focus:ring active:text-opacity-75 sm:w-auto">
                  Continue as Business
                </Button>
              </Link>

              <Link href={"/customer/login"}>
                <Button className="bg-slate-500 px-12 py-3 text-sm font-medium text-white hover:primary hover:text-muted focus:outline-none focus:ring active:bg-primary sm:w-auto">
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
