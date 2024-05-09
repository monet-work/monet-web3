import { authenticate } from "@/lib/api-requests";
import { useMutation } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import useLocalStorage from "./useLocalStorage";

const useAuth = () => {
  const activeAccount = useActiveAccount();
  const pathname = usePathname();
  const [accessToken, setAccessToken] = useLocalStorage(
    "accessToken",
    undefined
  );

  const isLoginRoute = pathname.includes("login");

  const authMutation = useMutation({
    mutationFn: authenticate,
  });

  useEffect(() => {
    if (!activeAccount) return;
    if (!isLoginRoute) return;
    if (!accessToken) return;

    authMutation.mutate({
      walletAddress: activeAccount.address,
      accessToken,
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
