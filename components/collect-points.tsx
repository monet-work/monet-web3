"use client";

import { useActiveAccount } from "thirdweb/react";
import PointCard from "./point-card";
import { BackgroundGradient } from "./ui/background-gradient";
import { Point } from "@/models/point.model";

const pointsData: Point[] = [
  {
    title: "Post a tweet! (1 points)",
    description: "Post a tweet about us and earn 1 points",
    points: 1,
    id: "post-tweet",
  },
  {
    title: "Write a blog post! (5 points)",
    description: "Write a blog post about us and earn 5 points",
    points: 5,
    id: "write-blog-post",
  },
  {
    title: "Review us on Google! (10 points)",
    description: "Review us on Google and earn 10 points",
    points: 10,
    id: "review-google",
  },
  {
    title: "Create a YouTube video! (20 points)",
    description: "Write a blog post about us and earn 20 points",
    points: 20,
    id: "youtube-video",
  },
];

const CollectPoints = () => {
  const account = useActiveAccount();
  const walletAddress = account?.address;

  return (
    <div>
      <h2 className="text-4xl font-bold text-center text-black dark:text-white">
        Collect Points
      </h2>
      <p className="text-center text-lg text-black dark:text-white">
        Collect points based on your activity.
      </p>

      {walletAddress ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16">
          {/* {pointsData.map((point) => (
            <PointCard
              key={point.id}
              id={point.id}
              title={point.title}
              description={point.description}
              points={point.points}
            />
          ))} */}
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
