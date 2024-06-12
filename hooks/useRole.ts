import { ROUTES_CONFIG } from "@/config/routes.config";
import { Role } from "@/models/role.model";
import { usePathname } from "next/navigation";
import { useState } from "react";

const useRole = () => {
  const pathname = usePathname();
  const [userRoles, setUserRoles] = useState<Role[]>([]);

  const hasRole = (requiredRoles: Role["role"][]) => {
    const routePath = ROUTES_CONFIG.protectedRoutes.find((route) =>
      route.path.includes(pathname)
    );

    if (!routePath) return false;

    const routeRoles = routePath.roles;
    if (!routeRoles) return false;

    const hasRole = requiredRoles.some((role) => routeRoles.includes(role));
    return hasRole;
  };

  const hasAdminRole = () => hasRole(["ADMIN"]);
  const hasCompanyRole = () => hasRole(["COMPANY"]);
  const hasCustomerRole = () => hasRole(["CUSTOMER"]);

  return {
    userRoles,
    setUserRoles,
    hasRole,
    hasAdminRole,
    hasCompanyRole,
    hasCustomerRole,
  };
};

export default useRole;
