import MarketplaceHeader from "@/components/marketplace-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
     <MarketplaceHeader />
      {children}
    </div>
  );
}
