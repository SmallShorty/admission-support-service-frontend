import {
  HStack,
  Input,
  Button,
  Box,
  createListCollection,
  Select,
  Portal,
  Switch,
  Text,
} from "@chakra-ui/react";
import { Search, Plus } from "lucide-react";
import { AdmissionIntentCategory } from "@features/tickets/model/types";
import { INTENT_METADATA } from "@features/tickets/model/intentMetadata";

interface TemplatesControlsProps {
  search: string;
  onSearch: (val: string) => void;
  category: string[];
  onCategoryChange: (val: string[]) => void;
  onAddClick: () => void;
  includeInactive: boolean;
  onIncludeInactiveChange: (val: boolean) => void;
}

const categories = createListCollection({
  items: [
    { label: "Все категории", value: "all" },
    ...Object.values(AdmissionIntentCategory).map((value) => ({
      label: INTENT_METADATA[value].label,
      value,
    })),
  ],
});

export const TemplatesControls = ({
  search,
  onSearch,
  category,
  onCategoryChange,
  onAddClick,
  includeInactive,
  onIncludeInactiveChange,
}: TemplatesControlsProps) => {
  return (
    <HStack gap="4" justify="space-between" mb="6" width="full">
      <HStack flex="1" maxW="2xl" gap="4">
        {/* Поиск */}
        <Box position="relative" flex="1">
          <Box
            position="absolute"
            left="3"
            top="50%"
            transform="translateY(-50%)"
            color="fg.muted"
            zIndex="10"
          >
            <Search size={18} />
          </Box>
          <Input
            placeholder="Поиск шаблонов по названию или alias..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            pl="10"
            bg="bg.panel"
          />
        </Box>

        <Select.Root
          collection={categories}
          value={category}
          onValueChange={(e) => onCategoryChange(e.value)}
          width="240px"
        >
          <Select.Trigger bg="white">
            <Select.ValueText placeholder="Категория" bg="white" />
          </Select.Trigger>

          <Portal>
            <Select.Positioner zIndex="100">
              <Select.Content bg="white" shadow="md" borderRadius="md">
                {categories.items.map((cat) => (
                  <Select.Item
                    item={cat}
                    key={cat.value}
                    cursor="pointer"
                    _hover={{ bg: "bg.muted" }}
                  >
                    <Select.ItemText>{cat.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        {/* Переключатель неактивных */}
        <Switch.Root
          checked={includeInactive}
          onCheckedChange={({ checked }) => onIncludeInactiveChange(checked)}
        >
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>
            <Text fontSize="sm" color="fg.muted" whiteSpace="nowrap">
              Неактивные
            </Text>
          </Switch.Label>
        </Switch.Root>
      </HStack>

      {/* Кнопка добавления */}
      <Button onClick={onAddClick} variant="solid" gap="2">
        <Plus size={18} />
        Добавить шаблон
      </Button>
    </HStack>
  );
};
