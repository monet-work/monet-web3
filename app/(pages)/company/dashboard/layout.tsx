import Navbar from "@/components/navbar";

type Props = {
  children: React.ReactNode;
};

export const CompanyDashboardPageLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default CompanyDashboardPageLayout;
