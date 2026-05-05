import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Portal,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Spinner,
  Stack,
  Text,
  Textarea,
  createListCollection,
} from "@chakra-ui/react";
import { usePublicIntegration } from "@features/integrations/hooks/queries/usePublicIntegration";
import { useSubmitPublicIntegration } from "@features/integrations/hooks/mutations/useSubmitPublicIntegration";
import { EventType, PublicSubmitPayload } from "@features/integrations/model/types";

const eventTypeOptions = createListCollection({
  items: [
    { label: "Информационное", value: EventType.INFORMATIONAL },
    { label: "Ошибка", value: EventType.FAILURE },
  ],
});

const EVENT_TYPE_LABEL: Record<EventType, string> = {
  [EventType.INFORMATIONAL]: "Информационное",
  [EventType.FAILURE]: "Ошибка",
};

const PublicIntegrationPage: FC = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: integration, isLoading, isError } = usePublicIntegration(slug);
  const submitMutation = useSubmitPublicIntegration(slug);

  const [theme, setTheme] = useState("");
  const [source, setSource] = useState("");
  const [eventType, setEventType] = useState<EventType | "">("");
  const [contentStr, setContentStr] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!integration) return;

    setSubmitError(null);
    const payload: PublicSubmitPayload = {};

    if (integration.isThemeEditable && theme !== "") payload.theme = theme;
    if (integration.isSourceEditable && source !== "") payload.source = source;
    if (integration.isTypeEditable && eventType !== "") payload.eventType = eventType;
    if (integration.isContentEditable && contentStr !== "") {
      try {
        payload.content = JSON.parse(contentStr);
      } catch {
        setSubmitError("Поле content содержит невалидный JSON");
        return;
      }
    }

    submitMutation.mutate(payload, {
      onSuccess: () => setSubmitted(true),
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Произошла ошибка при отправке";
        setSubmitError(typeof msg === "string" ? msg : JSON.stringify(msg));
      },
    });
  };

  if (isLoading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="lg" color="teal.500" />
      </Flex>
    );
  }

  if (isError || !integration) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Alert.Root status="error" maxW="md" borderRadius="lg">
          <Alert.Indicator />
          <Alert.Title>Интеграция не найдена или неактивна</Alert.Title>
        </Alert.Root>
      </Flex>
    );
  }

  if (submitted) {
    return (
      <Flex minH="100vh" align="center" justify="center" p="6">
        <Alert.Root status="success" maxW="md" borderRadius="lg">
          <Alert.Indicator />
          <Stack gap="1">
            <Alert.Title>Отправлено успешно</Alert.Title>
            <Alert.Description>Ваше уведомление принято и будет обработано.</Alert.Description>
          </Stack>
        </Alert.Root>
      </Flex>
    );
  }

  const initialTheme = integration.theme;
  const initialSource = integration.source;
  const initialEventType = integration.eventType;
  const initialContent = JSON.stringify(integration.content, null, 2);

  return (
    <Flex minH="100vh" align="center" justify="center" p="6" bg="gray.50">
      <Box
        bg="white"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="border.subtle"
        p="8"
        width="full"
        maxW="lg"
        shadow="sm"
      >
        <Stack gap="6">
          <Stack gap="1">
            <Heading size="lg" color="teal.600">{integration.name}</Heading>
            <Text fontSize="xs" color="gray.400" fontFamily="mono">{integration.slug}</Text>
          </Stack>

          {/* eventType */}
          <Stack gap="2">
            <Text fontSize="sm" fontWeight="medium" color="gray.700">Тип события</Text>
            {integration.isTypeEditable ? (
              <SelectRoot
                collection={eventTypeOptions}
                value={eventType ? [eventType] : [initialEventType]}
                onValueChange={(e) => setEventType(e.value[0] as EventType)}
                width="full"
              >
                <SelectTrigger bg="white">
                  <SelectValueText placeholder="Выберите тип" />
                </SelectTrigger>
                <Portal>
                  <SelectPositioner zIndex="100">
                    <SelectContent bg="white" shadow="md" borderRadius="md">
                      {eventTypeOptions.items.map((item) => (
                        <SelectItem item={item} key={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectPositioner>
                </Portal>
              </SelectRoot>
            ) : (
              <Badge
                colorPalette={initialEventType === EventType.FAILURE ? "red" : "blue"}
                variant="subtle"
                size="md"
                width="fit-content"
              >
                {EVENT_TYPE_LABEL[initialEventType]}
              </Badge>
            )}
          </Stack>

          {/* theme */}
          <Stack gap="2">
            <Text fontSize="sm" fontWeight="medium" color="gray.700">Тема</Text>
            {integration.isThemeEditable ? (
              <Input
                value={theme || initialTheme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Введите тему"
              />
            ) : (
              <Text fontSize="sm" color="gray.600">{initialTheme || "—"}</Text>
            )}
          </Stack>

          {/* source */}
          <Stack gap="2">
            <Text fontSize="sm" fontWeight="medium" color="gray.700">Источник</Text>
            {integration.isSourceEditable ? (
              <Input
                value={source || initialSource}
                onChange={(e) => setSource(e.target.value)}
                placeholder="URL источника"
              />
            ) : (
              <Text fontSize="sm" fontFamily="mono" color="gray.600" wordBreak="break-all">
                {initialSource || "—"}
              </Text>
            )}
          </Stack>

          {/* content */}
          <Stack gap="2">
            <Text fontSize="sm" fontWeight="medium" color="gray.700">Содержимое</Text>
            {integration.isContentEditable ? (
              <Textarea
                value={contentStr || initialContent}
                onChange={(e) => setContentStr(e.target.value)}
                rows={6}
                fontFamily="mono"
                fontSize="sm"
                placeholder='{"key": "value"}'
              />
            ) : (
              <Box
                as="pre"
                fontSize="xs"
                fontFamily="mono"
                bg="gray.50"
                borderRadius="md"
                p="3"
                overflowX="auto"
                borderWidth="1px"
                borderColor="border.subtle"
              >
                {initialContent}
              </Box>
            )}
          </Stack>

          {submitError && (
            <Alert.Root status="error" borderRadius="md">
              <Alert.Indicator />
              <Alert.Title>{submitError}</Alert.Title>
            </Alert.Root>
          )}

          <Button
            colorPalette="teal"
            onClick={handleSubmit}
            loading={submitMutation.isPending}
            disabled={submitMutation.isPending}
          >
            Отправить
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default PublicIntegrationPage;
