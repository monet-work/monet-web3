import { DataTable } from "../data-table/data-table";
import { UserPointsColumns } from "./table-columns/user-points-columns";

const UserPointsTable = () => {
  return (
    <DataTable
      columns={UserPointsColumns}
      data={[]}
      noResultsMessage={"No users found."}
    ></DataTable>
  );
};

export default UserPointsTable;
