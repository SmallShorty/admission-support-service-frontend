"use client";

import { FC, useEffect, useState } from "react";
import { Tabs, Box, Text } from "@chakra-ui/react";

const KnowledgeBasePage: FC = () => {
  return (
    <Box p={5}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        База знаний
      </Text>

      <Tabs.Root lazyMount unmountOnExit defaultValue="templates">
        <Tabs.List>
          <Tabs.Trigger value="templates">Шаблоны сообщений</Tabs.Trigger>
          <Tabs.Trigger value="categories">Категории обращений</Tabs.Trigger>
          <Tabs.Trigger value="dictionary">Словарь переменных</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="templates">
          <Box p={4}>
            <Text mb={2}>Здесь будут шаблоны ваших сообщений.</Text>
            <TickValue />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="categories">
          <Box p={4}>
            <Text mb={2}>Список категорий для классификации обращений.</Text>
            <TickValue />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="dictionary">
          <Box p={4}>
            <Text mb={2}>
              Справочник доступных переменных (например, {"{userName}"}).
            </Text>
            <TickValue />
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

// Вспомогательный компонент для проверки жизненного цикла (из вашего примера)
const TickValue = () => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setValue((v) => v + 1);
    }, 1000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <Text as="span" fontWeight="bold" color="tomato">
      Секунд на вкладке: {value}
    </Text>
  );
};

export default KnowledgeBasePage;
