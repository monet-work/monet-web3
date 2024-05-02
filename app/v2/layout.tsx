import CompanyAuthWrapper from "@/components/company-auth-wrapper";
import Navbar from "@/components/v2/navbar";

type Props = {
  children: React.ReactNode;
};

const V2Layout: React.FC<Props> = ({ children }) => {
  return (
    <CompanyAuthWrapper>
      <Navbar />
      {children}
    </CompanyAuthWrapper>
  );
};

export default V2Layout;
