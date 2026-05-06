import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Center,
  Field,
  Grid,
  Heading,
  HStack,
  Input,
  Progress,
  Separator,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { classifierApi } from "@shared/axiosInstance";
import { AdmissionIntentCategory } from "@features/tickets/model/types";
import { INTENT_METADATA } from "@features/tickets/model/intentMetadata";
import { IntentCategoryBadge } from "@features/tickets/components/IntentCategoryBadge";

import { staggerContainer, fadeUp, fadeIn } from "@shared/animations";

interface DemoBreakdown {
  w_topic: number;
  base_weight: number;
  k_conf: number;
  w_status: number;
  score_bonus: number;
}

interface DemoApplicant {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
  is_fallback: boolean;
}

interface DemoResult {
  category: AdmissionIntentCategory;
  confidence: number;
  priority: number;
  breakdown: DemoBreakdown;
  applicant: DemoApplicant;
}

interface DemoPayload {
  snils: string;
  text: string;
}

const BREAKDOWN_META: Record<
  keyof DemoBreakdown,
  { label: string; color: string }
> = {
  w_topic: { label: "Вес темы", color: "#6366f1" },
  base_weight: { label: "Базовый вес", color: "#0d9488" },
  k_conf: { label: "Коэф. уверен.", color: "#f59e0b" },
  w_status: { label: "Статус заявки", color: "#10b981" },
  score_bonus: { label: "Итог. надбавка", color: "#ec4899" },
};

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);

export default function DemoPage() {
  const [snils, setSnils] = useState("");
  const [text, setText] = useState("");
  const reduceMotion = useReducedMotion();

  const mutation = useMutation<DemoResult, Error, DemoPayload>({
    mutationFn: (payload) =>
      classifierApi
        .post<DemoResult>("/api/v1/process", payload)
        .then((r: { data: DemoResult }) => r.data),
    onSuccess: (data) => {
      if (data.applicant.is_fallback) {
        console.warn(
          "[DemoPage] is_fallback: true — данные абитуриента фиктивные",
        );
      }
    },
  });

  const motionProps = reduceMotion
    ? {}
    : { initial: "hidden", animate: "visible", variants: staggerContainer };

  if (mutation.isPending) {
    return (
      <Center minH="60vh">
        <VStack gap={4}>
          <Spinner size="xl" color="teal.500" borderWidth="3px" />
          <MotionBox
            {...(reduceMotion
              ? {}
              : { initial: "hidden", animate: "visible", variants: fadeIn })}
          >
            <Text color="gray.500" fontSize="sm">
              Анализируем обращение...
            </Text>
          </MotionBox>
        </VStack>
      </Center>
    );
  }

  if (mutation.isSuccess) {
    const d = mutation.data;
    const categoryColor = INTENT_METADATA[d.category].color;
    const priorityPct = Math.min(100, Math.max(0, d.priority));
    const confidencePct = Math.round(d.confidence * 100);

    return (
      <MotionBox
        initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        w="full"
        maxW="780px"
        mx="auto"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, md: 0 }}
      >
        <VStack gap={6} align="stretch">
          <VStack gap={3} align="start">
            <Box
              px={3}
              py={1}
              borderRadius="full"
              bg="teal.50"
              border="1px solid"
              borderColor="teal.100"
              display="inline-flex"
            >
              <Text fontSize="xs" fontWeight="semibold" color="teal.700">
                AI-классификатор · Демо
              </Text>
            </Box>
            <Heading size="2xl" color="gray.800" lineHeight="1.2">
              Обращение классифицировано
            </Heading>
          </VStack>

          <Box
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.100"
            shadow="md"
            overflow="hidden"
          >
            {/* Абитуриент */}
            <Box
              px={6}
              py={5}
              css={{ background: `${categoryColor}08` }}
              borderBottom="1px solid"
              borderColor="gray.100"
            >
              <HStack gap={4} align="center">
                <Box
                  w="48px"
                  h="48px"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  css={{
                    background: `${categoryColor}18`,
                    border: `2px solid ${categoryColor}40`,
                  }}
                >
                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                    css={{ color: categoryColor }}
                  >
                    {d.applicant.lastName[0]}
                  </Text>
                </Box>
                <VStack align="start" gap={0}>
                  <Text fontWeight="bold" fontSize="md" color="gray.800">
                    {d.applicant.lastName} {d.applicant.firstName}{" "}
                    {d.applicant.patronymic}
                  </Text>
                  <Text fontSize="sm" color="gray.500" fontFamily="mono">
                    {d.applicant.email}
                  </Text>
                </VStack>
              </HStack>
            </Box>

            <Box p={6}>
              {/* Категория */}
              <VStack align="start" gap={2} mb={5}>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.400"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Категория запроса
                </Text>
                <IntentCategoryBadge category={d.category} showIcon size="md" />
              </VStack>

              <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={5}
                mb={5}
              >
                <VStack align="start" gap={2} w="full">
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.400"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Индекс приоритета
                  </Text>
                  <HStack gap={3} w="full">
                    <Progress.Root
                      flex={1}
                      value={priorityPct}
                      colorPalette="teal"
                      variant="outline"
                      size="sm"
                    >
                      <Progress.Track>
                        <Progress.Range />
                      </Progress.Track>
                    </Progress.Root>
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      color="gray.500"
                      minW="36px"
                      textAlign="right"
                    >
                      {Math.round(d.priority)} / 100
                    </Text>
                  </HStack>
                </VStack>

                <VStack align="start" gap={2} w="full">
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.400"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Достоверность классификации
                  </Text>
                  <HStack gap={3} w="full">
                    <Progress.Root
                      flex={1}
                      value={confidencePct}
                      colorPalette="teal"
                      variant="outline"
                      size="sm"
                    >
                      <Progress.Track>
                        <Progress.Range />
                      </Progress.Track>
                    </Progress.Root>
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      color="gray.500"
                      minW="36px"
                      textAlign="right"
                    >
                      {confidencePct}%
                    </Text>
                  </HStack>
                </VStack>
              </Grid>

              <Separator mb={5} />

              <VStack align="start" gap={3}>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.400"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Разбивка приоритета
                </Text>
                <Grid templateColumns="repeat(5, 1fr)" gap={3} w="full">
                  {(Object.keys(BREAKDOWN_META) as (keyof DemoBreakdown)[]).map(
                    (key) => {
                      const meta = BREAKDOWN_META[key];
                      const val = d.breakdown[key];
                      return (
                        <Box
                          key={key}
                          borderRadius="xl"
                          p={3}
                          css={{ background: `${meta.color}12` }}
                          border="1px solid"
                          borderColor="transparent"
                          style={{ borderColor: `${meta.color}25` }}
                        >
                          <Text
                            fontSize="10px"
                            fontWeight="semibold"
                            textTransform="uppercase"
                            letterSpacing="wider"
                            css={{ color: meta.color }}
                          >
                            {meta.label}
                          </Text>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            css={{ color: meta.color }}
                            mt={0.5}
                          >
                            {key === "k_conf" ? val.toFixed(2) : `+${val}`}
                          </Text>
                        </Box>
                      );
                    },
                  )}
                </Grid>
              </VStack>
            </Box>
          </Box>

          <Button
            variant="ghost"
            colorPalette="teal"
            size="sm"
            alignSelf="center"
            onClick={() => mutation.reset()}
          >
            Попробовать снова
          </Button>
        </VStack>
      </MotionBox>
    );
  }

  return (
    <MotionVStack
      {...motionProps}
      maxW="520px"
      w="full"
      mx="auto"
      py={{ base: 8, md: 14 }}
      px={{ base: 4, md: 0 }}
      gap={8}
      align="stretch"
    >
      <MotionBox {...(reduceMotion ? {} : { variants: fadeUp })}>
        <VStack gap={3} align="start">
          <Box
            px={3}
            py={1}
            borderRadius="full"
            bg="teal.50"
            border="1px solid"
            borderColor="teal.100"
            display="inline-flex"
          >
            <Text fontSize="xs" fontWeight="semibold" color="teal.700">
              Пример интеграции
            </Text>
          </Box>
          <Heading size="2xl" color="gray.800" lineHeight="1.2">
            Обработка обращения абитуриента
          </Heading>
          <Text color="gray.500" fontSize="sm" lineHeight="1.6">
            Приёмные комиссии вузов могут встраивать эту форму на собственный
            сайт — интеграция настраивается под любой дизайн и сценарий работы
            со студентами.
          </Text>
        </VStack>
      </MotionBox>

      <MotionBox {...(reduceMotion ? {} : { variants: fadeUp })}>
        <Box
          bg="white"
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.100"
          shadow="md"
          p={6}
        >
          <VStack gap={5} align="stretch">
            <Field.Root>
              <Field.Label fontSize="sm" fontWeight="medium" color="gray.700">
                СНИЛС
              </Field.Label>
              <Input
                value={snils}
                onChange={(e) => setSnils(e.target.value)}
                placeholder="123-456-789 01"
                size="md"
                borderRadius="lg"
              />
            </Field.Root>

            <Field.Root>
              <Field.Label fontSize="sm" fontWeight="medium" color="gray.700">
                Текст обращения
              </Field.Label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Опишите проблему или вопрос..."
                rows={5}
                resize="none"
                borderRadius="lg"
              />
            </Field.Root>

            {mutation.isError && (
              <Alert.Root status="error" borderRadius="lg">
                <Alert.Indicator />
                <Alert.Title>
                  {(
                    mutation.error as {
                      response?: { data?: { message?: string } };
                    }
                  )?.response?.data?.message ??
                    "Произошла ошибка при обработке запроса"}
                </Alert.Title>
              </Alert.Root>
            )}

            <Button
              colorPalette="teal"
              w="full"
              size="md"
              borderRadius="lg"
              loading={mutation.isPending}
              disabled={!snils.trim() || !text.trim() || mutation.isPending}
              onClick={() =>
                mutation.mutate({ snils: snils.trim(), text: text.trim() })
              }
            >
              Отправить обращение
            </Button>
          </VStack>
        </Box>
      </MotionBox>
    </MotionVStack>
  );
}
