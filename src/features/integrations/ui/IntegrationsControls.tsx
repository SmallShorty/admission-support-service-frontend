import { FC } from "react";
import {
  HStack,
  Input,
  Button,
  Box,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
  createListCollection,
} from "@chakra-ui/react";
import { Search, Plus } from "lucide-react";
import { EventType } from "../model/types";

const eventTypeOptions = createListCollection({
  items: [
    { label: "Все типы", value: "" },
    { label: "Информационные", value: EventType.INFORMATIONAL },
    { label: "Ошибки", value: EventType.FAILURE },
  ],
});

interface IntegrationsControlsProps {
  search: string;
  onSearch: (val: string) => void;
  eventType: EventType | undefined;
  onEventTypeChange: (val: EventType | undefined) => void;
  onAddClick: () => void;
}

export const IntegrationsControls: FC<IntegrationsControlsProps> = ({
  search,
  onSearch,
  eventType,
  onEventTypeChange,
  onAddClick,
}) => {
  return (
    <HStack gap="4" justify="space-between" mb="6" width="full">
      <HStack flex="1" maxW="xl" gap="3">
        <Box position="relative" flex="1">
          <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color="gray.400" zIndex="10">
            <Search size={18} />
          </Box>
          <Input
            placeholder="Поиск по названию или slug..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            pl="10"
            bg="white"
          />
        </Box>

        <SelectRoot
          collection={eventTypeOptions}
          value={eventType ? [eventType] : [""]}
          onValueChange={(e) => {
            const val = e.value[0];
            onEventTypeChange(val ? (val as EventType) : undefined);
          }}
          width="48"
        >
          <SelectTrigger bg="white">
            <SelectValueText placeholder="Все типы" />
          </SelectTrigger>
          <SelectContent>
            {eventTypeOptions.items.map((item) => (
              <SelectItem item={item} key={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </HStack>

      <Button onClick={onAddClick} gap="2">
        <Plus size={18} />
        Добавить событие
      </Button>
    </HStack>
  );
};
