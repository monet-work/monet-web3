export const ROUTES_CONFIG: { protectedRoutes: ROUTE[] } = {
  protectedRoutes: [
    {
      path: "/admin/dashboard",
      roles: ["ADMIN"],
    },
    {
      path: "/company/dashboard",
      roles: ["COMPANY"],
    },
    {
      path: "/customer/dashboard",
      roles: ["CUSTOMER"],
    },
    {
      path: "/marketplace",
      roles: ["CUSTOMER", "COMPANY", "ADMIN"],
    },
    {
      path: "/marketplace/:id",
      roles: ["CUSTOMER", "COMPANY", "ADMIN"],
    }
  ],
};

type ROUTE = {
  path: string;
  roles: string[];
};
