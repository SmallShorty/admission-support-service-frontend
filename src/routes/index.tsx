import HomePage from "@/pages/HomePage/HomePage";
import { LoginPage } from "@/pages/LoginPage/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import BareLayout from "@/shared/components/Layout/BareLayout";
import Layout from "@/shared/components/Layout/Layout";
import { createBrowserRouter } from "react-router-dom";
import { RoleProtectedRoute } from "./RoleProtectedRoute";
import { AccountRole } from "@/app/entities/account/model/types";

export const router = createBrowserRouter([
  {
    element: (
      <RoleProtectedRoute
        allowedRoles={[
          AccountRole.OPERATOR,
          AccountRole.ADMIN,
          AccountRole.SUPERVISOR,
        ]}
      />
    ),
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
        ],
      },
    ],
  },
  {
    element: <BareLayout />,
    children: [
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);
