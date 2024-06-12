"use client";

import useCustomerAuth from "@/hooks/useCustomerAuth";

type Props = {
  children: React.ReactNode;
};

const CustomerAuthWrapper: React.FC<Props> = ({ children }) => {
  useCustomerAuth();

  return <div>{children}</div>;
};

export default CustomerAuthWrapper;
