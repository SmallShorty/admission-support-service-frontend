"use client";

import { FC, useState } from "react";
import {
  SimpleGrid,
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Skeleton,
  Alert,
  Separator,
} from "@chakra-ui/react";
import { Panel } from "@shared/components/ui/panel";
import { LuCopy, LuCheck } from "react-icons/lu";
import { useVariables } from "../hooks/queries/useVariables";
import { Variable } from "../model/types";

interface VariableCardProps {
  variable: Variable;
}

const VariableInfoCard: FC<VariableCardProps> = ({ variable }) => {
  const [copied, setCopied] = useState(false);

  const syntax = `{${variable.name}}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(syntax);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Panel overflow="hidden" display="flex" flexDirection="column" borderWidth="1px" borderColor="border.subtle">
      {/* Syntax + copy — главная строка */}
      <HStack
        px="3"
        py="2.5"
        bg="bg.muted"
        borderBottomWidth="1px"
        borderColor="border.subtle"
        justify="space-between"
        gap="2"
      >
        <Text
          fontFamily="mono"
          fontSize="sm"
          fontWeight="bold"
          color="teal.fg"
          userSelect="all"
        >
          {syntax}
        </Text>
        <Button
          size="xs"
          variant="ghost"
          onClick={handleCopy}
          color={copied ? "teal.fg" : "fg.muted"}
          px="1.5"
          minW="0"
          aria-label="Скопировать"
        >
          {copied ? <LuCheck size={13} /> : <LuCopy size={13} />}
        </Button>
      </HStack>

      {/* Description */}
      <Box px="3" pt="3" pb="2.5">
        <Text fontSize="sm" color="fg.default" lineHeight="snug">
          {variable.description}
        </Text>
      </Box>

      <Separator />

      {/* Meta rows */}
      <VStack align="stretch" gap="0" divideY="1px" px="3" py="2">
        <HStack justify="space-between" gap="3" py="1.5">
          <Text fontSize="10px" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="fg.subtle" flexShrink={0}>
            Источник
          </Text>
          <Text fontFamily="mono" fontSize="10px" color="fg.muted" textAlign="right" lineBreak="anywhere">
            {variable.sourceField}
          </Text>
        </HStack>
        <HStack justify="space-between" gap="3" py="1.5">
          <Text fontSize="10px" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="fg.subtle" flexShrink={0}>
            Фолбэк
          </Text>
          <Text fontFamily="mono" fontSize="10px" color="fg.muted" textAlign="right">
            «{variable.fallbackText}»
          </Text>
        </HStack>
      </VStack>
    </Panel>
  );
};

const CardSkeleton: FC = () => (
  <Panel overflow="hidden" borderWidth="1px" borderColor="border.subtle">
    <Box px="3" py="2.5" bg="bg.muted" borderBottomWidth="1px" borderColor="border.subtle">
      <Skeleton height="4" width="40%" />
    </Box>
    <Box px="3" pt="3" pb="2.5">
      <Skeleton height="3" mb="1.5" />
      <Skeleton height="3" width="70%" />
    </Box>
    <Separator />
    <VStack align="stretch" gap="0" px="3" py="2">
      <HStack justify="space-between" py="1.5">
        <Skeleton height="2.5" width="20%" />
        <Skeleton height="2.5" width="50%" />
      </HStack>
      <HStack justify="space-between" py="1.5">
        <Skeleton height="2.5" width="20%" />
        <Skeleton height="2.5" width="30%" />
      </HStack>
    </VStack>
  </Panel>
);

export const VariableDictionary: FC = () => {
  const { data: variables, isLoading, isError } = useVariables();

  if (isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap="4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </SimpleGrid>
    );
  }

  if (isError) {
    return (
      <Alert.Root status="error" borderRadius="xl">
        <Alert.Indicator />
        <Alert.Title>Не удалось загрузить переменные</Alert.Title>
      </Alert.Root>
    );
  }

  if (!variables?.length) {
    return (
      <Box py="16" textAlign="center" color="fg.muted" fontSize="sm">
        Переменные не найдены
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap="4">
      {variables.map((variable) => (
        <VariableInfoCard key={variable.id} variable={variable} />
      ))}
    </SimpleGrid>
  );
};
