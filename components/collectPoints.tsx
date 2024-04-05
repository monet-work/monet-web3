"use client";

import { useActiveAccount } from "thirdweb/react";
import PointCard from "./pointCard";
import { BackgroundGradient } from "./ui/background-gradient";

const pointsData = [
  {
    title: "Post a tweet! (1 points)",
    description: "Post a tweet about us and earn 1 points",
    points: 1,
  },
  {
    title: "Write a blog post! (5 points)",
    description: "Write a blog post about us and earn 5 points",
    points: 5,
  },
  {
    title: "Review us on Google! (10 points)",
    description: "Review us on Google and earn 10 points",
    points: 10,
  },
  {
    title: "Write a blog post! (20 points)",
    description: "Write a blog post about us and earn 20 points",
    points: 20,
  },
];

const CollectPoints = () => {
  const account = useActiveAccount();
  const walletAddress = account?.address;
  console.log(walletAddress, 'wd')

  return (
    <div>
      <h2 className="text-4xl font-bold text-center text-black dark:text-white">
        Collect Points
      </h2>
      <p className="text-center text-lg text-black dark:text-white">
        Collect points based on your activity.
      </p>

      {walletAddress ? (
        <div className="grid grid-cols-2 gap-4 mt-16">
          {pointsData.map((point) => (
            <PointCard
              key={point.title}
              title={point.title}
              description={point.description}
              points={point.points}
            />
          ))}
        </div>
      ) : null}

      {!walletAddress ? (
        <div className="my-16">
          <BackgroundGradient className="rounded-[22px] max-w-lg py-2 px-8 bg-white dark:bg-zinc-900">
            <p className="text-lg text-black dark:text-white">
              Connect your wallet to start collecting points.
            </p>
          </BackgroundGradient>
        </div>
      ) : null}
    </div>
  );
};

export default CollectPoints;
