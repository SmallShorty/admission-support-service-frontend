import {
  selectIsAuth,
  selectAccount,
  selectIsLoading,
} from "@/app/entities/account/model/selectors";
import { AccountRole } from "@/app/entities/account/model/types";
import { useAppSelector } from "@/app/hooks";
import { Center, Spinner } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles: AccountRole[];
}

export const RoleProtectedRoute = ({ allowedRoles }: Props) => {
  const isAuth = useAppSelector(selectIsAuth);
  const account = useAppSelector(selectAccount);

  if (!isAuth) return <Navigate to="/login" replace />;

  if (!account) return <Navigate to="/login" replace />;

  if (account && !allowedRoles.includes(account.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
