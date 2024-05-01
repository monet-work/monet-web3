import Navbar from "@/components/v2/navbar";

type Props = {
  children: React.ReactNode;
};

const V2Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default V2Layout;
