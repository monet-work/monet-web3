export interface Point {
  id: "post-tweet" | "write-blog-post" | "review-google" | "youtube-video";
  title: string;
  description: string;
  points: number;
}

export interface CustomerPoint {
  value: number;
  owner: {
    user: {
      walletAddress: string;
      name: string;
    }
    name: string;
  };
}
