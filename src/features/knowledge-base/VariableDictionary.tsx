"use client";

import { FC, useState } from "react";
import {
  SimpleGrid,
  Box,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { LuCopy, LuCheck } from "react-icons/lu";

// 1. Моки данных
const variablesMock = [
  {
    id: "1",
    name: "Имя",
    description: "Полное имя абитуриента",
    example: "Иван Иванович Иванов",
    alias: "{fullName}",
  },
  {
    id: "2",
    name: "ID",
    description: "Уникальный номер обращения",
    example: "REQ-2024-0812",
    alias: "{ticketId}",
  },
  {
    id: "3",
    name: "Программа",
    description: "Выбранное направление подготовки",
    example: "Прикладная информатика",
    alias: "{programName}",
  },
  {
    id: "4",
    name: "Дата",
    description: "Дата подачи документов",
    example: "12 июля 2024",
    alias: "{applyDate}",
  },
  {
    id: "5",
    name: "Статус",
    description: "Текущий статус зачисления",
    example: "Рекомендован к зачислению",
    alias: "{statusText}",
  },
  {
    id: "6",
    name: "Телефон",
    description: "Контактный номер приемной комиссии",
    example: "+7 (495) 123-45-67",
    alias: "{supportPhone}",
  },
];

// 2. Компонент карточки
interface VariableCardProps {
  variable: (typeof variablesMock)[0];
}

const VariableInfoCard: FC<VariableCardProps> = ({ variable }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(variable.alias);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      bg="bg.panel"
      p="4"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="border.subtle"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minH="180px"
    >
      <Box mb="4">
        <HStack justify="space-between" align="start" gap="2" mb="3">
          <Text
            fontWeight="medium"
            color="fg.default"
            fontSize="sm"
            lineHeight="snug"
          >
            {variable.description}
          </Text>
          <Badge
            variant="subtle"
            colorPalette="teal"
            fontFamily="mono"
            fontSize="10px"
            px="1.5"
            py="0.5"
            borderRadius="sm"
          >
            {variable.name}
          </Badge>
        </HStack>

        <VStack align="stretch" gap="1.5">
          <Text
            fontSize="10px"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            color="fg.muted"
          >
            Пример вывода:
          </Text>
          <Box
            bg="bg.muted"
            p="2"
            borderRadius="md"
            borderWidth="1px"
            borderColor="border.subtle"
          >
            <Text fontStyle="italic" color="fg.muted" fontSize="xs">
              "{variable.example}"
            </Text>
          </Box>
        </VStack>
      </Box>

      <Button
        onClick={handleCopy}
        fontSize="sm"
        fontWeight="bold"
        h="10"
        w="full"
        gap="2"
      >
        {copied ? (
          <LuCheck size={14} />
        ) : (
          <LuCopy size={14} style={{ opacity: 0.6 }} />
        )}
        {variable.alias}
      </Button>
    </Box>
  );
};

// 3. Основной компонент словаря
export const VariableDictionary: FC = () => {
  return (
    <SimpleGrid
      columns={{
        base: 1,
        sm: 2,
        lg: 3,
        xl: 4,
      }}
      gap="4"
    >
      {variablesMock.map((variable) => (
        <VariableInfoCard key={variable.id} variable={variable} />
      ))}
    </SimpleGrid>
  );
};
