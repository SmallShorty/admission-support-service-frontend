import { AccountRole } from "@/app/entities/account/model/types";
import { useAppSelector } from "@/app/hooks";
import { Center, Spinner } from "@chakra-ui/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
interface Props {
  allowedRoles?: AccountRole[];
  redirectTo?: string;
}
export const RoleProtectedRoute = ({
  allowedRoles = [],
  redirectTo = "/login",
}: Props) => {
  const location = useLocation();
  const {
    isAuth,
    data: user,
    isLoading,
    isInitialized,
  } = useAppSelector((state) => state.account);
  if (!isInitialized || isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue" />
      </Center>
    );
  }
  if (!isAuth || !user) {
    return (
      <Navigate
        to={redirectTo}
        state={{
          from: location,
        }}
        replace
      />
    );
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};
interface PublicRouteProps {
  redirectIfAuth?: string;
}
export const PublicRoute = ({ redirectIfAuth = "/" }: PublicRouteProps) => {
  const { isAuth, isLoading, isInitialized } = useAppSelector(
    (state) => state.account,
  );
  if (!isInitialized || isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue" />
      </Center>
    );
  }
  if (isAuth) {
    return <Navigate to={redirectIfAuth} replace />;
  }
  return <Outlet />;
};
