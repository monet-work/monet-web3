"use client";

import useCompanyAuth from "@/hooks/useCompanyAuth";

type Props = {
  children: React.ReactNode;
};

const CompanyAuthWrapper: React.FC<Props> = ({ children }) => {
  const { loading } = useCompanyAuth();

  return <div>{children}</div>;
};

export default CompanyAuthWrapper;
