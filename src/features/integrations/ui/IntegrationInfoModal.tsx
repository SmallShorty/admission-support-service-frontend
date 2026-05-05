import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Input,
  Portal,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectRoot,
  SelectTrigger,
  Stack,
  Switch,
  Textarea,
  Text,
  createListCollection,
} from "@chakra-ui/react";
import { Info, AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  IntegrationDto,
  EventType,
  CreateIntegrationPayload,
  UpdateIntegrationPayload,
} from "../model/types";

const eventTypeOptions = createListCollection({
  items: [
    { label: "Информационное", value: EventType.INFORMATIONAL, icon: <Info size={14} color="#3182ce" /> },
    { label: "Ошибка", value: EventType.FAILURE, icon: <AlertCircle size={14} color="#e53e3e" /> },
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

  const [contentError, setContentError] = useState(false);

  const handleSubmit = () => {
    if (!form.slug || !form.name || !form.eventType || !form.source) return;

    let parsedContent: Record<string, unknown> = {};
    if (form.content.trim()) {
      try {
        parsedContent = JSON.parse(form.content);
        setContentError(false);
      } catch {
        setContentError(true);
        return;
      }
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
                  <Field.Label fontWeight="semibold">Системное имя</Field.Label>
                  <Input
                    placeholder="event.technical.key"
                    py="2.5"
                    rounded="lg"
                    value={form.slug}
                    onChange={(e) =>
                      setField("slug")(
                        e.target.value.toLowerCase().replace(/[^a-z0-9-.]/g, ""),
                      )
                    }
                  />
                </Field.Root>

                <Field.Root>
                  <Flex justify="space-between" align="center" mb="1.5" w="full">
                    <Field.Label fontWeight="semibold" mb="0">
                      Тема
                    </Field.Label>
                    <Flex align="center" gap="2">
                      <Text fontSize="xs" color="gray.500">
                        Редактировать
                      </Text>
                      <Switch.Root
                        size="sm"
                        colorPalette="teal"
                        checked={form.isThemeEditable}
                        onCheckedChange={(e) =>
                          setField("isThemeEditable")(e.checked)
                        }
                      >
                        <Switch.HiddenInput />
                        <Switch.Control />
                      </Switch.Root>
                    </Flex>
                  </Flex>
                  <Input
                    placeholder="Admissions, Technical, Communications..."
                    py="2.5"
                    rounded="lg"
                    value={form.theme}
                    onChange={(e) => setField("theme")(e.target.value)}
                  />
                </Field.Root>

                <Field.Root invalid={contentError}>
                  <Flex justify="space-between" align="center" mb="1.5" w="full">
                    <Field.Label fontWeight="semibold" mb="0">
                      Тело сообщения
                    </Field.Label>
                    <Flex align="center" gap="2">
                      <Text fontSize="xs" color="gray.500">
                        Редактировать
                      </Text>
                      <Switch.Root
                        size="sm"
                        colorPalette="teal"
                        checked={form.isContentEditable}
                        onCheckedChange={(e) =>
                          setField("isContentEditable")(e.checked)
                        }
                      >
                        <Switch.HiddenInput />
                        <Switch.Control />
                      </Switch.Root>
                    </Flex>
                  </Flex>
                  <Textarea
                    placeholder='{"текст": "Студент {{имя}} обновил статус", "chatId": "-100123"}'
                    rounded="lg"
                    rows={4}
                    fontFamily="mono"
                    fontSize="sm"
                    value={form.content}
                    onChange={(e) => {
                      setContentError(false);
                      setField("content")(e.target.value);
                    }}
                  />
                  {contentError && (
                    <Text fontSize="xs" color="red.500" mt="1">
                      Невалидный JSON
                    </Text>
                  )}
                </Field.Root>

                <Field.Root required>
                  <Flex justify="space-between" align="center" mb="1.5" w="full">
                    <Field.Label fontWeight="semibold" mb="0">
                      Система-источник
                    </Field.Label>
                    <Flex align="center" gap="2">
                      <Text fontSize="xs" color="gray.500">
                        Редактировать
                      </Text>
                      <Switch.Root
                        size="sm"
                        colorPalette="teal"
                        checked={form.isSourceEditable}
                        onCheckedChange={(e) =>
                          setField("isSourceEditable")(e.checked)
                        }
                      >
                        <Switch.HiddenInput />
                        <Switch.Control />
                      </Switch.Root>
                    </Flex>
                  </Flex>
                  <Input
                    placeholder="External API, Internal System..."
                    py="2.5"
                    rounded="lg"
                    value={form.source}
                    onChange={(e) => setField("source")(e.target.value)}
                  />
                </Field.Root>

                <Field.Root required>
                  <Flex justify="space-between" align="center" mb="1.5" w="full">
                    <Field.Label fontWeight="semibold" mb="0">
                      Тип события
                    </Field.Label>
                    <Flex align="center" gap="2">
                      <Text fontSize="xs" color="gray.500">
                        Редактировать
                      </Text>
                      <Switch.Root
                        size="sm"
                        colorPalette="teal"
                        checked={form.isTypeEditable}
                        onCheckedChange={(e) =>
                          setField("isTypeEditable")(e.checked)
                        }
                      >
                        <Switch.HiddenInput />
                        <Switch.Control />
                      </Switch.Root>
                    </Flex>
                  </Flex>
                  <SelectRoot
                    collection={eventTypeOptions}
                    value={form.eventType ? [form.eventType] : []}
                    onValueChange={(e) => setField("eventType")(e.value[0])}
                  >
                    <SelectTrigger rounded="lg" py="2.5" bg="white">
                      {form.eventType ? (
                        <Flex align="center" gap="2">
                          {eventTypeOptions.items.find((i) => i.value === form.eventType)?.icon}
                          <Text>
                            {eventTypeOptions.items.find((i) => i.value === form.eventType)?.label}
                          </Text>
                        </Flex>
                      ) : (
                        <Text color="gray.400">Выберите тип</Text>
                      )}
                    </SelectTrigger>
                    <Portal>
                      <SelectPositioner zIndex="100">
                        <SelectContent bg="white" shadow="md" borderRadius="md">
                          {eventTypeOptions.items.map((item) => (
                            <SelectItem item={item} key={item.value}>
                              <Flex align="center" gap="2">
                                {item.icon}
                                <Text>{item.label}</Text>
                              </Flex>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectPositioner>
                    </Portal>
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
                flex="1"
                py="2.5"
                rounded="lg"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                loading={isLoading}
              >
                {isEdit ? "Сохранить изменения" : "Добавить"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
