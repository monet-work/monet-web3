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
          <TabsList>
            <TabsTrigger onClick={() => setViewType("list")} value="list">
              <ListIcon />
            </TabsTrigger>
            {/* <TabsTrigger onClick={() => setViewType("grid")} value="grid">
              <GridIcon />
            </TabsTrigger> */}
          </TabsList>

          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Fill Type
                  </span>
                  <ArrowDownRightSquareIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Fill Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Partial Fill
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Full Fill</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <TabsContent value="list">
          <ListingsDataTable
            columns={AssetListingColumns}
            data={assetListings}
            loading={loading}
            noResultsMessage="No listings available."
            onRowClick={(listing) =>
              onListingSelected && onListingSelected(listing)
            }
          />
        </TabsContent>

        {/* <TabsContent value="grid">
          <Tabs defaultValue="All">
            {viewType === "grid" && (
              <TabsList className="duration-200 transition">
                <TabsTrigger defaultChecked value="All">
                  {" "}
                  <div>All</div>
                </TabsTrigger>
                <TabsTrigger value="Buy">
                  <div>Buy</div>
                </TabsTrigger>
                <TabsTrigger value="Sell">
                  <div>Sell</div>
                </TabsTrigger>
              </TabsList>
            )}
            <TabsContent value="All">
              <GridViewComponent assetListings={assetListings || []} />
            </TabsContent>
            <TabsContent value="Buy">Buy</TabsContent>
          </Tabs>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default TradesView;
