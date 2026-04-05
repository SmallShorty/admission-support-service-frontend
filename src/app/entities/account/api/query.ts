import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setAccount, logout } from "../model/accountSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { authApi } from "./accountApi";

export const useAccount = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 1. Запрос профиля (Query)
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: authApi.getProfile,
    // Запрос пойдет только если есть токен в localStorage
    enabled: !!localStorage.getItem("accessToken"),
    retry: false,
  });

  // 2. Мутация логина (Mutation)
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Сохраняем в Redux и LocalStorage через наш существующий экшен
      dispatch(
        setAccount({
          account: data.account,
          accessToken: data.token,
        }),
      );

      // Инвалидируем кэш профиля, чтобы React Query знал, что данные обновились
      queryClient.setQueryData(["profile"], data.account);

      navigate("/"); // Редирект на главную
    },
    onError: (error: any) => {
      console.error(
        "Ошибка входа:",
        error.response?.data?.message || error.message,
      );
    },
  });

  return {
    // Данные профиля
    profile: profileQuery.data,
    isProfileLoading: profileQuery.isLoading,
    profileError: profileQuery.error,

    // Методы и состояния логина
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  };
};
