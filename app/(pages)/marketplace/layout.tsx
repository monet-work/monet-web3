import MarketplaceHeader from "@/components/marketplace-header";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MarketplaceHeader />
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}
