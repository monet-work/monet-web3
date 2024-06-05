"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { Button } from "../ui/button";
import CompanyTableRowActions from "../company-table/data-table-row-actions";
import { Company } from "@/models/company.model";
import { User } from "@/models/user.model";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="id" />
    ),
    cell: ({ row }) => {
      return <div className="w-[200px]">{row.getValue("id")}</div>;
    },
  },
  {
    accessorKey: "point_contract_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Point Contract Address" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[200px]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {" "}
                {row.getValue<string>("point_contract_address").slice(0, 6) +
                  "........." +
                  row.getValue<string>("point_contract_address").slice(-5)}
              </TooltipTrigger>
              <TooltipContent>
                <p className="cursor-text">
                  {row.getValue<string>("point_contract_address")}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },

  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[200px]">
          {row.getValue<User>("user")?.email || ""}
        </div>
      );
    },
  },
  {
    id: "walletAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wallet Address" />
    ),
    cell: ({ row }) => {
      return (
        <div
          className="w-[200px]"
          title={row.getValue<any>("user")?.wallet_address || ""}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {" "}
                {row.getValue<any>("user")?.wallet_address.slice(0, 6) +
                  "........." +
                  row.getValue<any>("user")?.wallet_address.slice(-5)}
              </TooltipTrigger>
              <TooltipContent>
                <p className="cursor-text">
                  {row.getValue<any>("user")?.wallet_address}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "is_approved",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Approved" />
    ),
    cell: ({ row }) => (
      <div>{row.getValue("is_approved") ? `Yes` : `Pending`}</div>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => (
      <CompanyTableRowActions
        approved={row.getValue("is_approved") as boolean}
        companyUserId={row.getValue("id") as string}
      />
    ),
  },
];
