import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { AccountRole } from "@/app/entities/account/model/types";
import { RoleProtectedRoute, PublicRoute } from "./RoleProtectedRoute";

import Layout from "@/shared/components/Layout/Layout";
import BareLayout from "@/shared/components/Layout/BareLayout";
import AdminControlPanelPage from "@/pages/AdminControlPanelPage/AdminControlPanelPage";

const HomePage = lazy(() => import("@/pages/HomePage/HomePage"));
const LoginPage = lazy(() =>
  import("@/pages/LoginPage/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const WorkspacePage = lazy(() => import("@/pages/WorkspacePage/WorkspacePage"));
const TicketQueueBoardPage = lazy(
  () => import("@/pages/TicketQueueBoardPage/TicketQueueBoardPage"),
);
const KnowledgeBasePage = lazy(
  () => import("@/pages/KnowledgeBasePage/KnowledgeBasePage"),
);
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage/NotFoundPage"));
const IntegrationsPage = lazy(
  () => import("@/pages/IntegrationsPage/IntegrationsPage"),
);
const AnalyticsDashboardPage = lazy(
  () => import("@/pages/AnalyticsDashboardPage/AnalyticsDashboardPage"),
);
const ProfilePage = lazy(() => import("@/pages/ProfilePage/ProfilePage"));

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
          {
            path: "knowledge-base",
            element: (
              <PageLoader>
                <KnowledgeBasePage />
              </PageLoader>
            ),
          },
          {
            path: "profile",
            element: (
              <PageLoader>
                <ProfilePage />
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
        children: [
          { path: "/queue", element: <TicketQueueBoardPage /> },
          { path: "/admin-control-panel", element: <AdminControlPanelPage /> },
          {
            path: "/integrations",
            element: (
              <PageLoader>
                <IntegrationsPage />
              </PageLoader>
            ),
          },
          {
            path: "/analytics",
            element: (
              <PageLoader>
                <AnalyticsDashboardPage />
              </PageLoader>
            ),
          },
        ],
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
