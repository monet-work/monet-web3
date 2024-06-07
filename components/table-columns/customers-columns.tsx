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

export const CustomerColumns: ColumnDef<Company>[] = [
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
    accessorKey: "userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Id" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[200px]">
          <TooltipProvider>
            <Tooltip>
              {row.getValue("userId") ? (
                <TooltipTrigger>
                  {" "}
                  {row.getValue<string>("userId").slice(0, 6) +
                    "........." +
                    row.getValue<string>("userId").slice(-5)}
                </TooltipTrigger>
              ) : (
                ""
              )}
              <TooltipContent>
                <p className="cursor-text">{row.getValue<string>("userId")}</p>
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
];
