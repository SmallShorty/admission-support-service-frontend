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
import { useState } from "react";
import {
  Account,
  AccountRole,
  StaffRole,
} from "@/app/entities/account/model/types";

export interface AccountFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  role: StaffRole;
  password: string;
}

interface AccountInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
  onSave: (data: AccountFormData) => void;
  isLoading?: boolean;
}

const staffRoles = createListCollection({
  items: [
    { label: "Оператор", value: AccountRole.OPERATOR },
    { label: "Супервизор", value: AccountRole.SUPERVISOR },
    { label: "Администратор", value: AccountRole.ADMIN },
  ],
});

const getInitialRole = (account: Account | null): string => {
  if (!account || account.role === AccountRole.APPLICANT) return "";
  return account.role;
};

export const AccountInfoModal = ({
  open,
  onOpenChange,
  account,
  onSave,
  isLoading = false,
}: AccountInfoModalProps) => {
  const isEdit = !!account;

  const [form, setForm] = useState({
    firstName: account?.firstName ?? "",
    lastName: account?.lastName ?? "",
    middleName: account?.middleName ?? "",
    email: account?.email ?? "",
    role: getInitialRole(account),
    password: "",
  });

  const setField =
    (field: keyof typeof form) => (value: string) =>
      setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.role) return;
    if (!isEdit && !form.password) return;

    onSave({
      firstName: form.firstName,
      lastName: form.lastName,
      middleName: form.middleName,
      email: form.email,
      role: form.role as StaffRole,
      password: form.password,
    });
  };

  const isSubmitDisabled =
    isLoading ||
    !form.firstName ||
    !form.lastName ||
    !form.email ||
    !form.role ||
    (!isEdit && !form.password);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      placement="center"
      motionPreset="slide-in-bottom"
      unmountOnExit
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="2xl" boxShadow="2xl">
            <Dialog.Header py="5">
              <Dialog.Title fontSize="xl" fontWeight="bold">
                {isEdit ? "Редактировать сотрудника" : "Добавить нового сотрудника"}
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
                <Field.Root required>
                  <Field.Label fontWeight="semibold">Фамилия</Field.Label>
                  <Input
                    placeholder="Иванов"
                    py="2.5"
                    rounded="lg"
                    value={form.lastName}
                    onChange={(e) => setField("lastName")(e.target.value)}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label fontWeight="semibold">Имя</Field.Label>
                  <Input
                    placeholder="Иван"
                    py="2.5"
                    rounded="lg"
                    value={form.firstName}
                    onChange={(e) => setField("firstName")(e.target.value)}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">Отчество</Field.Label>
                  <Input
                    placeholder="Иванович"
                    py="2.5"
                    rounded="lg"
                    value={form.middleName}
                    onChange={(e) => setField("middleName")(e.target.value)}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label fontWeight="semibold">Email</Field.Label>
                  <Input
                    type="email"
                    placeholder="username@university.edu"
                    py="2.5"
                    rounded="lg"
                    value={form.email}
                    onChange={(e) => setField("email")(e.target.value)}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label fontWeight="semibold">Роль</Field.Label>
                  <SelectRoot
                    collection={staffRoles}
                    value={form.role ? [form.role] : []}
                    onValueChange={(e) => setField("role")(e.value[0])}
                  >
                    <SelectTrigger rounded="lg" py="2.5">
                      <SelectValueText placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffRoles.items.map((role) => (
                        <SelectItem item={role} key={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </Field.Root>

                {!isEdit && (
                  <Field.Root required>
                    <Field.Label fontWeight="semibold">Пароль</Field.Label>
                    <Input
                      type="password"
                      placeholder="Временный пароль"
                      py="2.5"
                      rounded="lg"
                      value={form.password}
                      onChange={(e) => setField("password")(e.target.value)}
                    />
                  </Field.Root>
                )}
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
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                loading={isLoading}
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
