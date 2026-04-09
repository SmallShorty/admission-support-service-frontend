"use client";

import { FC } from "react";
import { Tabs, Box } from "@chakra-ui/react";
import { LuMessageSquare, LuLayers, LuBook } from "react-icons/lu";
import { TicketCategories } from "./TicketCategories";
import { VariableDictionary } from "./VariableDictionary";

export const KnowledgeBaseTabs: FC = () => {
  return (
    <Box width="full">
      <Tabs.Root
        lazyMount
        unmountOnExit
        defaultValue="messageTemplates"
        variant="line" // Или оставьте стандартный, стиль с иконками хорошо смотрится на line
      >
        <Tabs.List>
          <Tabs.Trigger value="messageTemplates">
            <LuMessageSquare />
            Шаблоны сообщений
          </Tabs.Trigger>

          <Tabs.Trigger value="ticketCategories">
            <LuLayers />
            Категории обращений
          </Tabs.Trigger>

          <Tabs.Trigger value="variableDictionary">
            <LuBook />
            Словарь переменных
          </Tabs.Trigger>
        </Tabs.List>

        {/* Контентная часть */}
        <Box mt={6}>
          <Tabs.Content value="messageTemplates">
            {/* <MessageTemplates /> */}
          </Tabs.Content>

          <Tabs.Content value="ticketCategories">
            <TicketCategories />
          </Tabs.Content>

          <Tabs.Content value="variableDictionary">
            <VariableDictionary />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
};
