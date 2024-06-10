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
      path: "/",
      roles: [],
    },
  ],
};

type ROUTE = {
  path: string;
  roles: string[];
};
