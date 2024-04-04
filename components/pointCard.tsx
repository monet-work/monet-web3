import React, { useState } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import { Button } from "./ui/button";
import { useCustomerStore } from "@/store/customerStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { collectPoints } from "@/lib/api-requests";

type Props = {
  title: string;
  description: string;
  points: number;
};

const PointCard: React.FC<Props> = ({ points, title, description }) => {
  const customerStore = useCustomerStore();
  const collectPointsMutation = useMutation({
    mutationFn: collectPoints,
  });
  const [loading, setLoading] = useState(false);

  const handleCollectPoints = async (points: number) => {
    setLoading(true);

    collectPointsMutation.mutate(
      {
        walletAddress: customerStore.customer?.walletAddress || "",
        points: Number(points),
      },
      {
        onSuccess: () => {
          toast("Points collected successfully!");
          setLoading(false);
        },
        onError: () => {
          toast("Failed to collect points, please try again!");
          setLoading(false);
        },
      }
    );
  };
  return (
    <BackgroundGradient className="rounded-[22px] max-w-sm py-2 px-8 bg-white dark:bg-zinc-900">
      <div className="h-20">
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          {title}
        </p>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {description}
          <span className="font-bold">{points}</span> points
        </p>
      </div>
      <Button
        className="mt-4"
        onClick={() => handleCollectPoints(1)}
        loading={loading}
      >
        Collect
      </Button>
    </BackgroundGradient>
  );
};

export default PointCard;
