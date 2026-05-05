import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { chatSocket } from "@/features/chat/api/chatSocket";
import { useAppDispatch } from "@/app/store/hooks";
import { prependNotification } from "../../model/notificationsSlice";
import { NotificationDto } from "../../model/types";
import { notificationKeys } from "../queries/queryKeys";
import { toaster } from "@/shared/components/ui/toaster";

interface NewIntegrationNotificationPayload {
  notification: NotificationDto;
  integrationName: string;
  timestamp: string;
}

export const useNotificationWebSocket = (
  token: string | null,
  isAuthenticated: boolean,
) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = chatSocket.getSocket();
    if (!socket) return;

    const handle = (data: NewIntegrationNotificationPayload) => {
      dispatch(prependNotification({ ...data.notification, integrationName: data.integrationName }));
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toaster.create({
        title: "Новое уведомление",
        description: `От "${data.integrationName}"`,
        type: "info",
      });
    };

    socket.on("newIntegrationNotification", handle);
    return () => {
      socket.off("newIntegrationNotification", handle);
    };
  }, [token, isAuthenticated, queryClient, dispatch]);
};
