import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { AccountRole } from "@/app/entities/account/model/types";
import { RoleProtectedRoute, PublicRoute } from "./RoleProtectedRoute";

import Layout from "@/shared/components/Layout/Layout";
import BareLayout from "@/shared/components/Layout/BareLayout";

const HomePage = lazy(() => import("@/pages/HomePage/HomePage"));
const LoginPage = lazy(() =>
  import("@/pages/LoginPage/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const WorkspacePage = lazy(() => import("@/pages/WorkspacePage/WorkspacePage"));
const TicketQueueBoardPage = lazy(
  () => import("@/pages/TicketQueueBoardPage/TicketQueueBoardPage"),
);
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage/NotFoundPage"));

const PageLoader = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={null}>{children}</Suspense>
);

const ALL_STAFF_ROLES = [
  AccountRole.OPERATOR,
  AccountRole.ADMIN,
  AccountRole.SUPERVISOR,
];

export const router = createBrowserRouter([
  {
    // --- ПУБЛИЧНЫЕ МАРШРУТЫ ---
    element: <PublicRoute redirectIfAuth="/" />,
    children: [
      {
        element: <BareLayout />,
        children: [
          {
            path: "login",
            element: (
              <PageLoader>
                <LoginPage />
              </PageLoader>
            ),
          },
        ],
      },
    ],
  },
  {
    // --- ПРИВАТНЫЕ МАРШРУТЫ (STAFF) ---
    element: (
      <RoleProtectedRoute allowedRoles={ALL_STAFF_ROLES} redirectTo="/login" />
    ),
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: (
              <PageLoader>
                <HomePage />
              </PageLoader>
            ),
          },
          {
            path: "workspace",
            element: (
              <PageLoader>
                <WorkspacePage />
              </PageLoader>
            ),
          },
        ],
      },
    ],
  },
  {
    // --- ТОЛЬКО АДМИН ---
    element: (
      <RoleProtectedRoute allowedRoles={[AccountRole.ADMIN]} redirectTo="/" />
    ),
    children: [
      {
        element: <Layout />,
        children: [{ path: "/queue", element: <TicketQueueBoardPage /> }],
      },
    ],
  },
  {
    // --- СЛУЖЕБНЫЕ ---
    element: <BareLayout />,
    children: [
      {
        path: "*",
        element: (
          <PageLoader>
            <NotFoundPage />
          </PageLoader>
        ),
      },
    ],
  },
]);
