import { Tabs } from "@/components/ui/tabs";
import { AssetListing } from "@/models/asset-listing.model";
import { ListingsDataTable } from "./listings-table/listings-data-table";
import { UserListingColumns } from "./table-columns/user-listing-columns";

type Props = {
  assetListings: AssetListing[];
  loading?: boolean;
};

const UserTradeView: React.FC<Props> = ({ assetListings, loading = true }) => {
  return (
    <div className="bg-muted/40 w-full">
      <Tabs defaultValue="list">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2"></div>
        </div>

        <ListingsDataTable
          columns={UserListingColumns}
          data={assetListings}
          loading={loading}
          noResultsMessage="No listings available."
        />
      </Tabs>
    </div>
  );
};

export default UserTradeView;
