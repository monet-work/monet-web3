"use client";

import { BriefcaseBusinessIcon, UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useConnect } from "thirdweb/react";
import { useUserStore } from "@/store/userStore";
import { USER_ROLE } from "@/app/api/v1/lib/role";
import { connectWallet } from "@/app/thirdweb";
import useLocalStorage from "@/hooks/useLocalStorage";

const Login = () => {
  const { connect, isConnecting, error } = useConnect();
  const [roleRequested, setRoleRequested] = useLocalStorage("roleRequested", "");
  const userStore = useUserStore();


  const handleContinueAsCustomer = () => {
    setRoleRequested(USER_ROLE.CUSTOMER);
    connectWallet(connect); 
  };

  const handleContinueAsBusiness = () => {
    setRoleRequested(USER_ROLE.COMPANY);
    connectWallet(connect);
  };

  return (
    <Card className="p-6">
      <CardContent className="py-4">
        <div className="flex justify-center text-center h-[150px]">
          <div className="flex flex-col justify-between">
            <Button onClick={handleContinueAsCustomer} loading={isConnecting}>
              <UserIcon className="mr-2 h-4 w-4" /> Continue as Customer
            </Button>
            <p>
              <span className="text-typography-gray">or</span>
            </p>
            <Button onClick={handleContinueAsBusiness} loading={isConnecting}>
              <BriefcaseBusinessIcon className="mr-2 h-4 w-4" /> Continue as
              Business
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Login;
