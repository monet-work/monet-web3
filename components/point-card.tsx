import React, { useState } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
// import { collectPoints } from "@/lib/api-requests";
import { useActiveAccount } from "thirdweb/react";

type Props = {
  id: 'post-tweet' | 'write-blog-post' | 'review-google' | 'youtube-video';
  title: string;
  description: string;
  points: number;
};

const PointCard: React.FC<Props> = ({ id, points, title, description }) => {
  // const customerStore = useCustomerStore();
  const account = useActiveAccount();
  const walletAddress = account?.address;
  // const collectPointsMutation = useMutation({
  //   mutationFn: collectPoints,
  // });
  const [loading, setLoading] = useState(false);

  const handleCollectPoints = async (id: Props['id'], points: number) => {
    setLoading(true);

    if(!walletAddress) return;

    // collectPointsMutation.mutate(
    //   {
    //     walletAddress: walletAddress || "",
    //     points: Number(points),
    //   },
    //   {
    //     onSuccess: (data) => {
    //       // update points in store and invaliate cache
    //       // customerStore.setCustomer(data.data);
    //       toast.message(successMessageBasedOnKey(id), {
    //         description: `You have successfully collected ${points} points!`,
    //       })
    //       setLoading(false);
    //     },
    //     onError: () => {
    //       toast("Failed to collect points, please try again!");
    //       setLoading(false);
    //     },
    //   }
    // );
  };

  const successMessageBasedOnKey = (key: Props['id']) => {
    switch(title){
      case 'post-tweet':
        return 'Tweet posted successfully!';
      case 'write-blog-post':
        return 'Blog post written successfully!';
      case 'review-google':
        return 'Google review posted successfully!';
      case 'youtube-video':
        return 'YouTube video created successfully!';
      default:
        return 'Points collected successfully!';
    }
  }

  return (
    <BackgroundGradient className="rounded-[22px] max-w-sm py-2 px-8 bg-white dark:bg-zinc-900 h-full">
      <div className="min-h-40">
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          {title}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {description}
          <span className="font-bold">{points}</span> points
        </p>
      </div>
      <Button
        className="mb-4"
        onClick={() => handleCollectPoints(id, points)}
        loading={loading}
      >
        Collect
      </Button>
    </BackgroundGradient>
  );
};

export default PointCard;
