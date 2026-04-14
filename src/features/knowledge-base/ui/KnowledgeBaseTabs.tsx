"use client";

import { FC } from "react";
import { Tabs, Box, Link } from "@chakra-ui/react";
import { LuMessageSquare, LuLayers, LuBook } from "react-icons/lu";
import { MessageTemplates } from "./MessageTemplates";
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
          <Tabs.Trigger value="messageTemplates" asChild>
            <Link unstyled href="#message-templates">
              <LuMessageSquare />
              Шаблоны сообщений
            </Link>
          </Tabs.Trigger>

          <Tabs.Trigger value="ticketCategories" asChild>
            <Link unstyled href="#ticket-categories">
              <LuLayers />
              Категории обращений
            </Link>
          </Tabs.Trigger>

          <Tabs.Trigger value="variableDictionary" asChild>
            <Link unstyled href="#variable-dictionary">
              <LuBook />
              Словарь переменных
            </Link>
          </Tabs.Trigger>
        </Tabs.List>

        {/* Контентная часть */}
        <Box mt={6}>
          <Tabs.Content value="messageTemplates">
            <MessageTemplates />
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
