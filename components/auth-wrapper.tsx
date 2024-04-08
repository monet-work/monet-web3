"use client";

import useAuth from "@/hooks/useAuth";
import useThirdwebEvents from "@/hooks/useThirdwebEvents";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const AuthWrapper: React.FC<Props> = ({ children }) => {
  useAuth();
  const { eventsData } = useThirdwebEvents();
  console.log("event watched", eventsData);

  useEffect(() => {


  }, [eventsData])

  return <>{children}</>;
};

export default AuthWrapper;
