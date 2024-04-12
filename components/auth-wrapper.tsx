"use client";

import useAuth from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

const AuthWrapper: React.FC<Props> = ({ children }) => {
  useAuth();

  return <div>{children}</div>;
};

export default AuthWrapper;
