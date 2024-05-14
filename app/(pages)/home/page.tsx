import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomePage = () => {
  return (
    <main>
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              Revolutionizing Loyalty with
              <span className="sm:block"> Decentralized Rewards. </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt
              illo tenetur fuga ducimus numquam ea!
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
