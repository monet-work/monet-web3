import MarketplaceHeader from "@/components/marketplace-header";
import PageLoader from "@/components/page-loader";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MarketplaceHeader />
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </div>
  );
}
