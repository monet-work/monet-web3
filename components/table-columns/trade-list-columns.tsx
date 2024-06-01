"use client";

import { Company, User } from "@/xata";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { Button } from "../ui/button";
import { approveCompany, rejectCompany } from "@/lib/api-requests";
import CompanyTableRowActions from "../company-table/data-table-row-actions";

export const TradeListColumns: ColumnDef<{
  Price: string;
  Amount: string;
  Collateral: string;
  FillType: any;
}>[] = [
  // {
  //   accessorKey: "Price",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Price" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("price")}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "Amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      return <div className="lg:w-[100px]">{row.getValue("Amount")}</div>;
    },
  },
  {
    accessorKey: "Collateral",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Collateral" />
    ),
    cell: ({ row }) => {
      return <div className="lg:w-[100px]">{row.getValue("Collateral")}</div>;
    },
  },

  {
    id: "FillType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="FillType" />
    ),
    cell: ({ row }) => (
      <div className="lg:w-[150px]">{row.getValue("FillType")}</div>
    ),
  },
];
