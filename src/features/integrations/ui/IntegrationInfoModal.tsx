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
  Textarea,
  Checkbox,
  SimpleGrid,
  createListCollection,
} from "@chakra-ui/react";
import { Check } from "lucide-react";
import { useState } from "react";
import {
  IntegrationDto,
  EventType,
  CreateIntegrationPayload,
  UpdateIntegrationPayload,
} from "../model/types";

const eventTypeOptions = createListCollection({
  items: [
    { label: "Информационное", value: EventType.INFORMATIONAL },
    { label: "Ошибка", value: EventType.FAILURE },
  ],
});

export type IntegrationFormData = CreateIntegrationPayload;

interface IntegrationInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: IntegrationDto | null;
  onSave: (data: IntegrationFormData | UpdateIntegrationPayload) => void;
  isLoading?: boolean;
}

export const IntegrationInfoModal = ({
  open,
  onOpenChange,
  integration,
  onSave,
  isLoading = false,
}: IntegrationInfoModalProps) => {
  const isEdit = !!integration;

  const [form, setForm] = useState({
    slug: integration?.slug ?? "",
    name: integration?.name ?? "",
    eventType: integration?.eventType ?? "",
    theme: integration?.theme ?? "",
    source: integration?.source ?? "",
    content: integration ? JSON.stringify(integration.content, null, 2) : "",
    isTypeEditable: integration?.isTypeEditable ?? true,
    isThemeEditable: integration?.isThemeEditable ?? true,
    isSourceEditable: integration?.isSourceEditable ?? true,
    isContentEditable: integration?.isContentEditable ?? true,
  });

  const setField =
    <K extends keyof typeof form>(field: K) =>
    (value: (typeof form)[K]) =>
      setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.slug || !form.name || !form.eventType || !form.source) return;

    let parsedContent: Record<string, unknown> = {};
    try {
      parsedContent = form.content ? JSON.parse(form.content) : {};
    } catch {
      return;
    }

    onSave({
      slug: form.slug,
      name: form.name,
      eventType: form.eventType as EventType,
      theme: form.theme,
      source: form.source,
      content: parsedContent,
      isTypeEditable: form.isTypeEditable,
      isThemeEditable: form.isThemeEditable,
      isSourceEditable: form.isSourceEditable,
      isContentEditable: form.isContentEditable,
    });
  };

  const isSubmitDisabled =
    isLoading || !form.slug || !form.name || !form.eventType || !form.source;

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
          <Dialog.Content rounded="2xl" boxShadow="2xl" maxW="lg">
            <Dialog.Header py="5">
              <Dialog.Title fontSize="xl" fontWeight="bold">
                {isEdit ? "Редактировать событие" : "Добавить событие"}
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
                    placeholder="Telegram Failure Alerts"
                    py="2.5"
                    rounded="lg"
                    value={form.name}
                    onChange={(e) => setField("name")(e.target.value)}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label fontWeight="semibold">Slug</Field.Label>
                  <Input
                    placeholder="telegram-failure-alert"
                    py="2.5"
                    rounded="lg"
                    value={form.slug}
                    onChange={(e) =>
                      setField("slug")(
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                      )
                    }
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label fontWeight="semibold">Тип события</Field.Label>
                  <SelectRoot
                    collection={eventTypeOptions}
                    value={form.eventType ? [form.eventType] : []}
                    onValueChange={(e) => setField("eventType")(e.value[0])}
                  >
                    <SelectTrigger rounded="lg" py="2.5">
                      <SelectValueText placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypeOptions.items.map((item) => (
                        <SelectItem item={item} key={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">Тема</Field.Label>
                  <Input
                    placeholder="dark"
                    py="2.5"
                    rounded="lg"
                    value={form.theme}
                    onChange={(e) => setField("theme")(e.target.value)}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label fontWeight="semibold">URL источника</Field.Label>
                  <Input
                    placeholder="https://api.telegram.org/bot123/sendMessage"
                    py="2.5"
                    rounded="lg"
                    value={form.source}
                    onChange={(e) => setField("source")(e.target.value)}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">
                    Содержимое (JSON)
                  </Field.Label>
                  <Textarea
                    placeholder='{"text": "Ticket {{id}} failed", "chatId": "-100123"}'
                    rounded="lg"
                    rows={4}
                    fontFamily="mono"
                    fontSize="sm"
                    value={form.content}
                    onChange={(e) => setField("content")(e.target.value)}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">
                    Редактируемые поля
                  </Field.Label>
                  <SimpleGrid columns={2} gap="3" mt="1">
                    <Checkbox.Root
                      checked={form.isTypeEditable}
                      onCheckedChange={(e) =>
                        setField("isTypeEditable")(!!e.checked)
                      }
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label fontSize="sm">Тип события</Checkbox.Label>
                    </Checkbox.Root>

                    <Checkbox.Root
                      checked={form.isThemeEditable}
                      onCheckedChange={(e) =>
                        setField("isThemeEditable")(!!e.checked)
                      }
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label fontSize="sm">Тема</Checkbox.Label>
                    </Checkbox.Root>

                    <Checkbox.Root
                      checked={form.isSourceEditable}
                      onCheckedChange={(e) =>
                        setField("isSourceEditable")(!!e.checked)
                      }
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label fontSize="sm">
                        URL источника
                      </Checkbox.Label>
                    </Checkbox.Root>

                    <Checkbox.Root
                      checked={form.isContentEditable}
                      onCheckedChange={(e) =>
                        setField("isContentEditable")(!!e.checked)
                      }
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label fontSize="sm">Содержимое</Checkbox.Label>
                    </Checkbox.Root>
                  </SimpleGrid>
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
                flex="1"
                py="2.5"
                rounded="lg"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                loading={isLoading}
              >
                {isEdit ? "Сохранить" : "Добавить"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
