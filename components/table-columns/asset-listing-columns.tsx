"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { AssetListing } from "@/models/asset-listing.model";

export const AssetListingColumns: ColumnDef<AssetListing>[] = [
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      return <div className="lg:w-[100px]">{row.getValue("amount")}</div>;
    },
  },
  {
    accessorKey: "listingType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Listing" />
    ),
    cell: ({ row }) => {
      return <div className="lg:w-[100px]">{row.getValue("listingType")}</div>;
    },
  },

  {
    accessorKey: "fillType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fill" />
    ),
    cell: ({ row }) => (
      <div className="lg:w-[150px]">{row.getValue("fillType")}</div>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("totalPrice")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
