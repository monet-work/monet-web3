"use client";

import { Button } from "./ui/button";
import { useAuth } from "@/context/auth-context";

const UnauthorizedAccess = () => {
  const { logout } = useAuth();
  return (
    <main className="bg-background flex w-full h-screen justify-center items-center">
      <div className="flex flex-col">
        <h1 className="text-white text-4xl font-bold">Unauthorized Access</h1>
        <p className="text-white text-lg">
          You are not authorized to access this page.
        </p>

        <Button
          className="mt-4"
          onClick={() => {
            logout();
          }}
        >
          Back to home
        </Button>
      </div>
    </main>
  );
};

export default UnauthorizedAccess;
