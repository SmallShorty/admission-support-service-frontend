"use client";

import { FC } from "react";
import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Icon,
  List,
} from "@chakra-ui/react";
import { Panel } from "@shared/components/ui/panel";
import { LuMessageSquare } from "react-icons/lu";
import { AdmissionIntentCategory } from "@features/tickets/model/types";
import { INTENT_METADATA } from "@features/tickets/model/intentMetadata";

export const requestCategories = [
  {
    id: 1,
    intent: AdmissionIntentCategory.TECHNICAL_ISSUES,
    content:
      "Трудности с доступом к системе, ошибки в работе сайта или мобильного приложения.",
    examples:
      "«Не могу зайти в личный кабинет», «Сайт выдает ошибку 500», «Не восстанавливается пароль»",
  },
  {
    id: 2,
    intent: AdmissionIntentCategory.DEADLINES_TIMELINES,
    content:
      "Информация о датах начала и окончания приема документов, экзаменов и этапов зачисления.",
    examples:
      "«До какого числа можно подать оригинал?», «Когда будут известны результаты тестирования?»",
  },
  {
    id: 3,
    intent: AdmissionIntentCategory.DOCUMENT_SUBMISSION,
    content:
      "Вопросы о перечне необходимых документов, способах их отправки и требованиях к копиям.",
    examples:
      "«Нужна ли справка 086-у при подаче?», «Можно ли отправить документы почтой?»",
  },
  {
    id: 4,
    intent: AdmissionIntentCategory.STATUS_VERIFICATION,
    content:
      "Отслеживание положения в списках, подтверждение получения документов приемной комиссией.",
    examples:
      "«Почему мой статус до сих пор 'На проверке'?», «Где найти себя в конкурсных списках?»",
  },
  {
    id: 5,
    intent: AdmissionIntentCategory.SCORES_COMPETITION,
    content:
      "Проходные баллы прошлых лет, учет индивидуальных достижений и расчет рейтинга.",
    examples:
      "«Сколько баллов дают за золотую медаль?», «Какой был проходной балл на бюджет в прошлом году?»",
  },
  {
    id: 6,
    intent: AdmissionIntentCategory.PAYMENTS_CONTRACTS,
    content:
      "Стоимость обучения, оформление договора, оплата материнским капиталом или образовательным кредитом.",
    examples:
      "«Где взять реквизиты для оплаты?», «Как оформить рассрочку на обучение?»",
  },
  {
    id: 7,
    intent: AdmissionIntentCategory.ENROLLMENT,
    content:
      "Процедура выхода приказов, подписание согласия на зачисление и следующие шаги после приказа.",
    examples:
      "«Когда выйдет приказ о зачислении на 1 курс?», «Нужно ли приходить лично после зачисления?»",
  },
  {
    id: 8,
    intent: AdmissionIntentCategory.DORMITORY_HOUSING,
    content:
      "Условия предоставления жилья, необходимые документы для заселения и стоимость проживания.",
    examples:
      "«Всем ли иногородним дают общежитие?», «Какие вещи нужно брать с собой при заселении?»",
  },
  {
    id: 9,
    intent: AdmissionIntentCategory.STUDIES_SCHEDULE,
    content:
      "Информация о графике занятий, дисциплинах, преподавателях и учебном процессе.",
    examples:
      "«Где посмотреть расписание занятий?», «Будет ли обучение в этом году очным или дистанционным?»",
  },
  {
    id: 10,
    intent: AdmissionIntentCategory.EVENTS,
    content:
      "Дни открытых дверей, олимпиады, вебинары и другие события для абитуриентов и студентов.",
    examples:
      "«Когда будет ближайший день открытых дверей?», «Где зарегистрироваться на олимпиаду?»",
  },
  {
    id: 11,
    intent: AdmissionIntentCategory.GENERAL_INFO,
    content:
      "Любые другие вопросы, которые не попадают в специализированные категории.",
    examples:
      "«Где находится главный корпус?», «Как связаться с деканатом факультета?»",
  },
  {
    id: 12,
    intent: AdmissionIntentCategory.PROGRAM_CONSULTATION,
    content:
      "Помощь в выборе направления подготовки, информация о специальностях и будущей профессии.",
    examples:
      "«Чем отличается 'Программная инженерия' от 'ИБ'?», «Какие предметы изучают на лингвистике?»",
  },
];

interface CategoryCardProps {
  category: (typeof requestCategories)[0];
}

const CategoryCard: FC<CategoryCardProps> = ({ category }) => {
  const meta = INTENT_METADATA[category.intent];
  const examplesList = category.examples.match(/«[^»]+»/g)
    ? category.examples.match(/«[^»]+»/g)!.map((s) => s.replace(/[«»]/g, ""))
    : [category.examples];

  return (
    <Panel
      p="5"
      borderWidth="1px"
      borderColor="border.subtle"
      boxShadow={`inset 4px 0 0 0 ${meta.color}, 0 1px 4px rgba(0,0,0,0.08)`}
      display="flex"
      flexDirection="column"
    >
      <VStack align="stretch" h="full" ps="2" gap="4">
        <Box flex="1">
          <HStack gap="2" mb="2">
            <Box
              w="2.5"
              h="2.5"
              borderRadius="full"
              bg={meta.color}
              shadow="sm"
            />
            <Text fontWeight="semibold" fontSize="15px" color="fg.default">
              {meta.label}
            </Text>
          </HStack>
          <Text fontSize="13px" color="fg.muted" lineHeight="relaxed">
            {category.content}
          </Text>
        </Box>

        <Box
          bg="bg.muted"
          borderRadius="lg"
          p="3.5"
          borderWidth="1px"
          borderColor="border.subtle"
          mt="auto"
        >
          <HStack gap="1.5" mb="2.5">
            <Icon size="xs" color="fg.subtle">
              <LuMessageSquare />
            </Icon>
            <Text
              fontSize="10px"
              fontWeight="semibold"
              color="fg.subtle"
              textTransform="uppercase"
              letterSpacing="widest"
            >
              Примеры вопросов
            </Text>
          </HStack>

          <List.Root gap="2" variant="plain">
            {examplesList.map((example, idx) => (
              <List.Item
                key={idx}
                fontSize="12px"
                color="fg.default"
                display="flex"
                alignItems="start"
                gap="2"
                lineHeight="snug"
              >
                <Box
                  w="1.5"
                  h="1.5"
                  borderRadius="full"
                  bg={meta.color}
                  mt="1.5"
                  opacity="0.8"
                  flexShrink="0"
                />
                <Text as="span">{example}</Text>
              </List.Item>
            ))}
          </List.Root>
        </Box>
      </VStack>
    </Panel>
  );
};

export const TicketCategories: FC = () => {
  return (
    <SimpleGrid
      columns={{
        base: 1,
        lg: 2,
        xl: 3,
      }}
      gap="4"
    >
      {requestCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </SimpleGrid>
  );
};
