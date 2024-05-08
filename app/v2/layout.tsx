import AuthWrapper from "@/components/v2/auth-wrapper";
import Navbar from "@/components/v2/navbar";

type Props = {
  children: React.ReactNode;
};

const V2Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <AuthWrapper>{children}</AuthWrapper>
    </>
  );
};

export default V2Layout;
