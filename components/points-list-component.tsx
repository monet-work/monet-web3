import React from "react";
import { DataTable } from "./data-table/data-table";
import { PointsListColumns } from "./table-columns/points-list-columns";

type Props = {
  Points: any[];
  isLoading: boolean;
};

function PointsListComponent({ Points, isLoading }: Props) {
  return (
    <div className="max-w-7xl">
      {" "}
      <DataTable
        columns={PointsListColumns}
        data={Points}
        loading={isLoading}
      />
    </div>
  );
}

export default PointsListComponent;
