import { DataTable } from "./data-table/data-table";
import { UserPointsColumns } from "./table-columns/user-points-columns";

type Props = {
  data: {
    name: string;
    wallet: string;
    value: string;
  }[];
};

const UserPointsTable: React.FC<Props> = ({ data }) => {
  console.log(data, 'data')
  return (
    <DataTable
      columns={UserPointsColumns}
      data={data}
      noResultsMessage={"No customer data found."}
    ></DataTable>
  );
};

export default UserPointsTable;
