import { columns } from "./company-columns";
import { DataTable } from "./data-table/data-table";

const CompanyList = () => {
  return (
    <div>
      <h2 className="mb-4 font-semibold text-slate-600p">Companies</h2>
      <DataTable columns={columns} data={[]} />
    </div>
  );
};

export default CompanyList;
