import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setAccount, logout, updateTokens } from "../model/accountSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { authApi } from "./accountApi";
import { useEffect } from "react";
export const useAccount = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const restoreSession = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;
    try {
      const data = await authApi.refresh(refreshToken);
      dispatch(
        setAccount({
          account: data.account,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }),
      );
      queryClient.setQueryData(["profile"], data.account);
      return data;
    } catch (error) {
      dispatch(logout());
      return null;
    }
  };
  useEffect(() => {
    const initAuth = async () => {
      const hasRefreshToken = !!localStorage.getItem("refreshToken");
      if (hasRefreshToken && !profileQuery.data) {
        await restoreSession();
      }
    };
    initAuth();
  }, []);
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: authApi.getProfile,
    enabled: !!localStorage.getItem("accessToken"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      dispatch(
        setAccount({
          account: data.account,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }),
      );
      queryClient.setQueryData(["profile"], data.account);
      navigate("/");
    },
    onError: (error: any) => {
      console.error(
        "Ошибка входа:",
        error.response?.data?.message || error.message,
      );
    },
  });
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      dispatch(logout());
      queryClient.clear();
      navigate("/login");
    },
    onError: () => {
      dispatch(logout());
      queryClient.clear();
      navigate("/login");
    },
  });
  return {
    profile: profileQuery.data,
    isProfileLoading: profileQuery.isLoading,
    profileError: profileQuery.error,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};
