"use client";
import { monetMarketplaceContract } from "@/app/contract-utils";
import { DataTable } from "@/components/data-table/data-table";
import { AdminListingColumns } from "@/components/table-columns/admin-listing-columns";
import { CustomerColumns } from "@/components/table-columns/customers-columns";
import { useEffect, useState } from "react";
import { readContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

export default function Listings() {
  const account = useActiveAccount();
  const wallet = account?.address;
  const [listingData, setListingData] = useState<any[]>([]);
  const [listingCount, setListingCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  console.log(listingData, "listingData");
  console.log(listingCount, "listingCount");

  const ListingCount = async () => {
    if (!wallet) return;
    const data = await readContract({
      contract: monetMarketplaceContract,
      method: "getListingCount",
    });
    setListingCount(Number(data));
  };

  const fetchListings = async () => {
    for (let i = 1; i <= listingCount!; i++) {
      const Listings = async () => {
        const data = await readContract({
          contract: monetMarketplaceContract,
          method: "getListing",
          params: [BigInt(i)],
        });
        console.log(data, "data", i);
        if (data) {
          setListingData((prev: any) => [...prev, data]);
        }
      };

      await Listings();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    ListingCount();
    listingCount > 0 && fetchListings();
  }, [wallet, listingCount]);

  return (
    <main className="bg-background">
      <div className="container">
        <div className="py-4">
          <div>
            <h2 className="mb-4 font-semibold text-slate-600p">Customers</h2>
            <DataTable
              enablePagination={true}
              columns={AdminListingColumns}
              data={listingData}
            // loading={isLoading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
