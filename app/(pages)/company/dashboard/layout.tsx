import PageLoader from "@/components/PageLoader";
import { Suspense } from "react";

type Props = {
  children: React.ReactNode;
};

const CompanyDashboardPageLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </div>
  );
};

export default CompanyDashboardPageLayout;