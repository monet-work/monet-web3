import React from "react";
import { DataTable } from "./data-table/data-table";
import { PointsListColumns } from "./table-columns/points-list-columns";
import { TradeListColumns } from "./table-columns/trade-list-columns";

type Props = {
  Points: any[];
  isLoading: boolean;
};

function TradeListComponent({ Points, isLoading }: Props) {
  return (
    <div className="max-w-7xl px-1 ">
      {" "}
      <DataTable columns={TradeListColumns} data={Points} loading={isLoading} />
    </div>
  );
}

export default TradeListComponent;
