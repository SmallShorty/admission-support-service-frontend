import { FC } from "react";
import {
  Button,
  HStack,
  Portal,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  createListCollection,
} from "@chakra-ui/react";
import { NotificationStatus } from "../model/types";

const statusOptions = createListCollection({
  items: [
    { label: "Все статусы", value: "" },
    { label: "Ожидает", value: NotificationStatus.PENDING },
    { label: "Отправлено", value: NotificationStatus.SENT },
    { label: "Ошибка", value: NotificationStatus.FAILED },
  ],
});

interface NotificationsControlsProps {
  status: NotificationStatus | undefined;
  onStatusChange: (val: NotificationStatus | undefined) => void;
}

export const NotificationsControls: FC<NotificationsControlsProps> = ({
  status,
  onStatusChange,
}) => {
  const hasFilters = status !== undefined;

  return (
    <HStack gap="3" wrap="wrap" mb="6">
      <SelectRoot
        collection={statusOptions}
        value={status ? [status] : [""]}
        onValueChange={(e) => {
          const val = e.value[0];
          onStatusChange(val ? (val as NotificationStatus) : undefined);
        }}
        width="44"
      >
        <SelectTrigger bg="white">
          <SelectValueText placeholder="Все статусы" />
        </SelectTrigger>
        <Portal>
          <SelectPositioner zIndex="100">
            <SelectContent bg="white" shadow="md" borderRadius="md">
              {statusOptions.items.map((item) => (
                <SelectItem item={item} key={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectPositioner>
        </Portal>
      </SelectRoot>

      {hasFilters && (
        <Button
          variant="ghost"
          size="md"
          colorPalette="gray"
          onClick={() => onStatusChange(undefined)}
        >
          Сбросить
        </Button>
      )}
    </HStack>
  );
};
