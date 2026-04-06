// components/AuthInitializer.tsx
import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { coreApi } from "@/shared/axiosInstance";
import {
  setInitialized,
  setAccount,
  logout,
} from "@/app/entities/account/model/accountSlice";

export const AuthInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // Нет refresh токена — завершаем инициализацию без авторизации
        dispatch(setInitialized(true));
        return;
      }

      try {
        // Пытаемся обновить accessToken через refresh endpoint
        const response = await coreApi.post("/auth/refresh", { refreshToken });
        const {
          accessToken,
          refreshToken: newRefreshToken,
          account,
        } = response.data;

        dispatch(
          setAccount({
            account,
            accessToken,
            refreshToken: newRefreshToken,
          }),
        );
      } catch (error) {
        // Если refresh не удался — очищаем всё
        console.error("Auth initialization failed:", error);
        dispatch(logout());
      } finally {
        // Убедимся, что initialized true
        dispatch(setInitialized(true));
      }
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
};
