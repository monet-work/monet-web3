import React from "react";
import { DataTable } from "./data-table/data-table";
import { TradeListColumns } from "./table-columns/trade-list-columns";

type Props = {
  Points: any[];
  isLoading: boolean;
};

const TradeListComponent: React.FC<Props> = ({ Points, isLoading }) => {
  return (
    <div className="container">
      <DataTable columns={TradeListColumns} data={Points} loading={isLoading} />
    </div>
  );
};

export default TradeListComponent;
