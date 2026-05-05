import { useMutation } from "@tanstack/react-query";
import { integrationsApi } from "../../api/integrationsApi";
import { toaster } from "@/shared/components/ui/toaster";

export const useTestIntegration = () => {
  return useMutation({
    mutationFn: (id: string) => integrationsApi.testIntegration(id),
    onSuccess: () => {
      toaster.create({
        title: "Тестовый вызов отправлен",
        description: "Уведомление будет получено через WebSocket",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Ошибка тестового вызова",
        type: "error",
      });
    },
  });
};
