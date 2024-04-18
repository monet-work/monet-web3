'use client';

import { Listing } from "@/models/listing";

type Props = {
  listings: Listing[];
};

const ListingContainer: React.FC<Props> = ({ listings }) => {
  return (
    <div>
      {!listings.length && (
        <div>
          <p className="text-white">No listings found</p>
        </div>
      )}
    </div>
  );
};

export default ListingContainer;