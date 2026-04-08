import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Stack,
  createListCollection,
} from "@chakra-ui/react";
import { Check } from "lucide-react";

interface AccountInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: any; // Если передано — режим редактирования
  onSave: (data: any) => void;
}

const roles = createListCollection({
  items: [
    { label: "Оператор", value: "Operator" },
    { label: "Старший оператор", value: "Senior Op" },
    { label: "Администратор", value: "Admin" },
  ],
});

export const AccountInfoModal = ({
  open,
  onOpenChange,
  account,
  onSave,
}: AccountInfoModalProps) => {
  const isEdit = !!account;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="2xl" boxShadow="2xl">
            <Dialog.Header py="5">
              <Dialog.Title fontSize="xl" fontWeight="bold">
                {isEdit
                  ? "Редактировать сотрудника"
                  : "Добавить нового сотрудника"}
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton
                  size="sm"
                  color="gray.400"
                  _hover={{ color: "gray.600", bg: "gray.100" }}
                />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body p="6">
              <Stack gap="4">
                {/* Поле: Полное имя */}
                <Field.Root>
                  <Field.Label fontWeight="semibold">Полное имя</Field.Label>
                  <Input
                    placeholder="Введите полное имя"
                    py="2.5"
                    rounded="lg"
                    defaultValue={
                      isEdit ? `${account.lastName} ${account.firstName}` : ""
                    }
                  />
                </Field.Root>

                {/* Поле: Email */}
                <Field.Root>
                  <Field.Label fontWeight="semibold">
                    Корпоративный email
                  </Field.Label>
                  <Input
                    type="email"
                    placeholder="username@university.edu"
                    py="2.5"
                    rounded="lg"
                    defaultValue={account?.corporateEmail ?? ""}
                  />
                </Field.Root>

                {/* Поле: Роль */}
                <Field.Root>
                  <Field.Label fontWeight="semibold">Роль</Field.Label>
                  <SelectRoot
                    collection={roles}
                    defaultValue={account ? [account.role] : undefined}
                  >
                    <SelectTrigger rounded="lg" py="2.5">
                      <SelectValueText placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.items.map((role) => (
                        <SelectItem item={role} key={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </Field.Root>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer p="6" gap="3">
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="subtle"
                  flex="1"
                  py="2.5"
                  rounded="lg"
                  bg="gray.100"
                  _hover={{ bg: "gray.200" }}
                >
                  Отмена
                </Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette="blue"
                flex="1"
                py="2.5"
                rounded="lg"
                onClick={() => onSave({})} // Логика сбора данных
              >
                <Check size={16} />
                {isEdit ? "Сохранить" : "Добавить"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
