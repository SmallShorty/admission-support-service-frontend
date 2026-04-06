import HomePage from "@/pages/HomePage/HomePage";
import { LoginPage } from "@/pages/LoginPage/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import BareLayout from "@/shared/components/Layout/BareLayout";
import Layout from "@/shared/components/Layout/Layout";
import { createBrowserRouter } from "react-router-dom";
import { RoleProtectedRoute, PublicRoute } from "./RoleProtectedRoute";
import { AccountRole } from "@/app/entities/account/model/types";
import WorkspacePage from "@/pages/WorkspacePage/WorkspacePage";

export const router = createBrowserRouter([
  {
    // Группа публичных маршрутов
    element: <PublicRoute redirectIfAuth="/" />,
    children: [
      {
        element: <BareLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
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
    ],
  },
  {
    element: (
      <RoleProtectedRoute
        allowedRoles={[
          AccountRole.OPERATOR,
          AccountRole.ADMIN,
          AccountRole.SUPERVISOR,
        ]}
        redirectTo="/login"
      />
    ),
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/workspace",
            element: <WorkspacePage />,
          },
        ],
      },
    ],
  },
]);
