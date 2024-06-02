import React from "react";
import { DataTable } from "./data-table/data-table";
import { PointsListColumns } from "./table-columns/points-list-columns";
import { useRouter } from "next/navigation";

type Props = {
  Points: any;
  isLoading: boolean;
};

const PointsList: React.FC<Props> = ({ Points, isLoading }) => {
  const router = useRouter();
  return (
    <div className="w-full">
      <DataTable
        columns={PointsListColumns}
        data={Points.pointsAssets}
        loading={isLoading}
        onRowClick={(rowData) => {
          const pointName = rowData.name;
          const urlEncodedPointName = encodeURIComponent(pointName);
          router.push(`/marketplace/${urlEncodedPointName}`);
        }}
      />
    </div>
  );
};

export default PointsList;
