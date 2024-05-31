import { CustomerPoint } from "@/models/point.model";
import { DataTable } from "./data-table/data-table";
import { UserPointsColumns } from "./table-columns/user-points-columns";

type Props = {
  data: {name: string, points: string, wallet_address: string}[];
};

const UserPointsTable: React.FC<Props> = ({ data }) => {
  return (
    <DataTable
      columns={UserPointsColumns}
      data={data}
      noResultsMessage={"No customer data found."}
    ></DataTable>
  );
};

export default UserPointsTable;
