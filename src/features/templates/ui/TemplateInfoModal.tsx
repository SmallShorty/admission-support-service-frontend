import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Menu,
  Portal,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { INTENT_METADATA } from "@features/tickets/model/intentMetadata";
import { AdmissionIntentCategory } from "@features/tickets/model/types";
import { Template } from "../model/types";

export interface TemplateFormData {
  title: string;
  alias: string;
  content: string;
  category: string;
}

interface TemplateInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
  onSave: (data: TemplateFormData) => void;
  isLoading?: boolean;
}

const CATEGORIES = (
  Object.entries(INTENT_METADATA) as [AdmissionIntentCategory, { label: string; color: string }][]
).map(([value, { label }]) => ({ value, label }));

export const TemplateInfoModal = ({
  open,
  onOpenChange,
  template,
  onSave,
  isLoading = false,
}: TemplateInfoModalProps) => {
  const isEdit = !!template;

  const [form, setForm] = useState({
    title: template?.title ?? "",
    alias: template?.alias ?? "",
    content: template?.content ?? "",
    category: (template as any)?.category ?? AdmissionIntentCategory.GENERAL_INFO,
  });

  const setField = (field: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.title || !form.alias || !form.content) return;
    onSave(form);
  };

  const isSubmitDisabled =
    isLoading || !form.title || !form.alias || !form.content;

  const currentCategoryLabel =
    CATEGORIES.find((c) => c.value === form.category)?.label ||
    "Выберите категорию";

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
                {isEdit ? "Редактировать шаблон" : "Добавить шаблон"}
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
                  <Field.Label fontWeight="semibold">Название</Field.Label>
                  <Input
                    placeholder="Приветствие абитуриента"
                    py="2.5"
                    rounded="lg"
                    value={form.title}
                    onChange={(e) => setField("title")(e.target.value)}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label fontWeight="semibold">Alias</Field.Label>
                  <Input
                    placeholder="welcome"
                    py="2.5"
                    rounded="lg"
                    fontFamily="mono"
                    value={form.alias}
                    onChange={(e) => setField("alias")(e.target.value)}
                  />
                </Field.Root>

                {/* Поле выбора категории */}
                <Field.Root required>
                  <Field.Label fontWeight="semibold">Категория</Field.Label>
                  <Menu.Root positioning={{ sameWidth: true }}>
                    <Menu.Trigger asChild>
                      <Button
                        variant="outline"
                        justifyContent="space-between"
                        width="full"
                        rounded="lg"
                        fontWeight="normal"
                      >
                        {currentCategoryLabel}
                        <ChevronDown size={16} />
                      </Button>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          {CATEGORIES.map((cat) => (
                            <Menu.Item
                              key={cat.value}
                              value={cat.value}
                              onClick={() => setField("category")(cat.value)}
                            >
                              {cat.label}
                            </Menu.Item>
                          ))}
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                </Field.Root>

                <Field.Root required>
                  <Field.Label fontWeight="semibold">Текст шаблона</Field.Label>
                  <Textarea
                    placeholder="Введите текст шаблона..."
                    rounded="lg"
                    rows={6}
                    resize="vertical"
                    value={form.content}
                    onChange={(e) => setField("content")(e.target.value)}
                  />
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
