import { FC } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Popover,
  Portal,
  Stack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { resetUnread } from "@/features/integrations/model/notificationsSlice";
import { NotificationStatus } from "@/features/integrations/model/types";

const STATUS_COLOR: Record<NotificationStatus, string> = {
  [NotificationStatus.PENDING]: "yellow",
  [NotificationStatus.SENT]: "green",
  [NotificationStatus.FAILED]: "red",
};

const STATUS_LABEL: Record<NotificationStatus, string> = {
  [NotificationStatus.PENDING]: "Ожидает",
  [NotificationStatus.SENT]: "Отправлено",
  [NotificationStatus.FAILED]: "Ошибка",
};

export const NotificationBell: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, unreadCount } = useAppSelector((state) => state.notifications);

  const handleOpen = () => {
    if (unreadCount > 0) {
      dispatch(resetUnread());
    }
  };

  return (
    <Popover.Root onOpenChange={(e) => e.open && handleOpen()}>
      <Popover.Trigger asChild>
        <Box position="relative" display="inline-flex">
          <Button variant="ghost" size="sm" aria-label="Уведомления" px="2">
            <Bell size={20} />
          </Button>
          {unreadCount > 0 && (
            <Box
              position="absolute"
              top="-1"
              right="-1"
              minW="18px"
              h="18px"
              bg="teal.500"
              color="white"
              borderRadius="full"
              fontSize="10px"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              justifyContent="center"
              px="1"
              pointerEvents="none"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Box>
          )}
        </Box>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content width="320px">
            <Popover.Arrow />
            <Popover.Body p="0">
              <Box borderBottomWidth="1px" borderColor="border.subtle" px="4" py="3">
                <Text fontWeight="semibold" fontSize="sm">
                  Уведомления
                </Text>
              </Box>

              <Box maxH="300px" overflowY="auto">
                {items.length === 0 ? (
                  <Flex align="center" justify="center" py="8">
                    <Text fontSize="sm" color="fg.muted">
                      Нет уведомлений
                    </Text>
                  </Flex>
                ) : (
                  <Stack gap="0" divideY="1px">
                    {items.map((item) => (
                      <Box key={item.id} px="4" py="3" _hover={{ bg: "gray.50/50" }}>
                        <HStack justify="space-between" mb="1">
                          <HStack gap="1">
                            <Text fontSize="sm" fontWeight="medium" lineClamp={1}>
                              {item.integrationName}
                            </Text>
                            {(item.payload as Record<string, unknown>)._test && (
                              <Badge colorPalette="gray" variant="outline" size="sm">
                                тест
                              </Badge>
                            )}
                          </HStack>
                          <Badge
                            colorPalette={STATUS_COLOR[item.status]}
                            variant="subtle"
                            size="sm"
                            flexShrink={0}
                          >
                            {STATUS_LABEL[item.status]}
                          </Badge>
                        </HStack>
                        <Text fontSize="xs" color="fg.muted">
                          {new Date(item.createdAt).toLocaleString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>

              <Box
                borderTopWidth="1px"
                borderColor="border.subtle"
                px="4"
                py="2"
              >
                <Button
                  variant="ghost"
                  size="xs"
                  colorPalette="teal"
                  width="full"
                  onClick={() => navigate("/integrations")}
                >
                  Все уведомления
                </Button>
              </Box>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
