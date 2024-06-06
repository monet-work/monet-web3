import Navbar from "@/components/navbar";
import PageLoader from "@/components/PageLoader";
import { Suspense } from "react";

type Props = {
  children: React.ReactNode;
};

const CustomerDashboardPageLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </>
  );
};

export default CustomerDashboardPageLayout;
