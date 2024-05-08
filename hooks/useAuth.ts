import { authenticate } from "@/lib/api-requests";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import useLocalStorage from "./useLocalStorage";

const useAuth = () => {
  const activeAccount = useActiveAccount();
  const [roleRequested, setRoleRequested] = useLocalStorage("roleRequested", "");

  const authMutation = useMutation({
    mutationFn: authenticate,
  });

  useEffect(() => {
    if (!activeAccount) return; 

    authMutation.mutate({
      walletAddress: activeAccount.address,
      roleRequested
    });
  }, [activeAccount]);
  

  return {
    user: authMutation.data?.data.user,
    isLoading: authMutation.isPending,
    error: authMutation.error,
    accessToken: authMutation.data?.data.accessToken,
  };
};

export default useAuth;
