import { ArrowDownRightSquareIcon, ListIcon, GridIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import GridViewComponent from "./grid-view-component";
import { AssetListing, ListingType } from "@/models/asset-listing.model";
import { AssetListingColumns } from "./table-columns/asset-listing-columns";
import { ListingsDataTable } from "./listings-table/listings-data-table";

type Props = {
  assetListings: AssetListing[];
  loading?: boolean;
  onListingSelected?: (listing: AssetListing) => void;
};

const TradesView: React.FC<Props> = ({
  assetListings,
  loading = true,
  onListingSelected,
}) => {
  const buyListings = assetListings.filter(
    (listing) => listing.listingType === ListingType.BUY
  );

  const sellListings = assetListings.filter(
    (listing) => listing.listingType === ListingType.SELL
  );

  const [viewType, setViewType] = useState<"list" | "grid">("list");
  const [selectedListing, setSelectedListing] = useState<
    AssetListing | undefined
  >(undefined);

  return (
    <div className="bg-muted/40 w-full">
      <Tabs defaultValue="list">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
          </div>
        </div>

        <ListingsDataTable
          columns={AssetListingColumns}
          data={assetListings}
          loading={loading}
          noResultsMessage="No listings available."
          onRowClick={(listing) =>
            onListingSelected && onListingSelected(listing)
          }
        />
      </Tabs>
    </div>
  );
};

export default TradesView;
