import { BackgroundGradient } from "./ui/background-gradient";
import { Button } from "./ui/button";

type Props = {};


const Listing: React.FC<Props> = ({}) => {
  return (
    <BackgroundGradient className="rounded-[22px] max-w-sm py-2 px-8 bg-white dark:bg-zinc-900 h-full">
      <div className="min-h-40">
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          {}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {}
          <span className="font-bold">{}</span> points
        </p>
      </div>
      <Button
        className="mb-4"
      >
        Collect
      </Button>
    </BackgroundGradient>
  );
};

export default Listing;
