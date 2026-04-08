import { HStack, Input, Button, Checkbox, Box } from "@chakra-ui/react";
import { Search, Plus } from "lucide-react";

interface AccountsControlsProps {
  search: string;
  onSearch: (val: string) => void;
  showApplicants: boolean;
  onToggleApplicants: (val: boolean) => void;
  onAddClick: () => void;
}

export const AccountsControls = ({
  search,
  onSearch,
  showApplicants,
  onToggleApplicants,
  onAddClick,
}: AccountsControlsProps) => {
  return (
    <HStack gap="4" justify="space-between" mb="6" width="full">
      <HStack flex="1" maxW="lg" position="relative">
        <Box position="absolute" left="3" color="gray.400" zIndex="10">
          <Search size={18} />
        </Box>
        <Input
          placeholder="Поиск по имени или ID..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          pl="10"
          bg="white"
        />

        <Checkbox.Root
          checked={showApplicants}
          onCheckedChange={(e) => onToggleApplicants(!!e.checked)}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label fontSize="sm" fontWeight="medium">
            Абитуриенты
          </Checkbox.Label>
        </Checkbox.Root>
      </HStack>

      <Button colorPalette="blue" onClick={onAddClick} gap="2">
        <Plus size={18} />
        Добавить аккаунт
      </Button>
    </HStack>
  );
};
