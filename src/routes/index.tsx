import HomePage from "@/pages/HomePage/HomePage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import BareLayout from "@/shared/components/Layout/BareLayout";
import Layout from "@/shared/components/Layout/Layout";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
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
  {
    element: <BareLayout />,
    children: [{ path: "*", element: <NotFoundPage /> }],
  },
]);
