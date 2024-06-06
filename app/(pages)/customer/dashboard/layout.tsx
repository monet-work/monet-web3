import Navbar from "@/components/navbar";

type Props = {
  children: React.ReactNode;
};

const CustomerDashboardPageLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default CustomerDashboardPageLayout;
