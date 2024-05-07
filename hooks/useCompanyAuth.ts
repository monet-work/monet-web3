import {
  authenticate,
  login,
} from "@/lib/api-requests";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import useLocalStorage from "./useLocalStorage";
import { useUserStore } from "@/store/userStore";

const useCompanyAuth = () => {
  const disconnect = useDisconnect();
  const account = useActiveAccount();
  const walletAddress = account?.address;
  const wallet = useActiveWallet();
  const userStore = useUserStore();
  const [accessToken, setAccessToken] = useLocalStorage(
    "accessToken",
    undefined
  );
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: login,
  });

  const authMutation = useMutation({
    mutationFn: authenticate,
  });

  useEffect(() => {
    if (!walletAddress) return;
    loginMutation.mutate(
      {
        walletAddress: walletAddress,
      },
      {
        onSuccess: (response) => {
          const { user, accessToken } = response.data;
          userStore.setUser(user);
          setAccessToken(accessToken);
          if (user.isWalletApproved) {
            router.push("/v2/dashboard");
          }
        },
        onError: (error: any) => {
          console.log("error", error);
        },
      }
    );
  }, [walletAddress]);

  useEffect(() => {
    if (!accessToken || !walletAddress || !wallet) return;
    authMutation.mutate(
      {
        walletAddress: walletAddress,
        accessToken: accessToken,
      },
      {
        onSuccess: (response) => {
          const user = response.data.user;
          userStore.setUser(user);
        },
        onError: (error: any) => {
          setAccessToken(undefined);
          disconnect.disconnect(wallet);
          router.push("/v2");
        },
      }
    );
  }, [walletAddress, accessToken]);

  useEffect(() => {
    if (!account) {
      setAccessToken(undefined);
      localStorage.clear();
      router.push("/v2");
    }
  }, [account]);


  return { loading: loginMutation.isPending || authMutation.isPending };
};

export default useCompanyAuth;
