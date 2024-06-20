import { columns } from "./table-columns/company-columns";
import { DataTable } from "./data-table/data-table";
import { Company } from "@/models/company.model";

type Props = {
  companies: Company[];
  loading?: boolean;
};

const CompanyList: React.FC<Props> = ({ companies, loading = false }) => {
  return (
    <div>
      <h2 className="mb-4 font-semibold text-slate-600p">Companies</h2>
      <DataTable columns={columns} data={companies} loading={loading} />
    </div>
  );
};

export default CompanyList;
