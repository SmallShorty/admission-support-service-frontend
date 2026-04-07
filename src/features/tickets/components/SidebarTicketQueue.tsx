import React, { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  Badge,
  Tabs,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { Inbox, UserCheck } from "lucide-react";
import { TicketCard } from "./TicketCard";
import { useAvailableQueue } from "../hooks/queries/useAvailableQueue";
import { useMyTickets } from "../hooks/queries/useMyTickets";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setSelectedTicketId } from "../model/ticketsSlice";

type ViewMode = "available" | "my";

export const SidebarTicketQueue = () => {
  const dispatch = useAppDispatch();
  const selectedTicketId = useAppSelector(
    (state) => state.tickets.selectedTicketId,
  );

  const [viewMode, setViewMode] = useState<ViewMode>("available");

  // Загрузка данных
  const {
    data: availableData,
    isLoading: isLoadingAvailable,
    error: availableError,
  } = useAvailableQueue(50, 0);

  const {
    data: myTicketsData,
    isLoading: isLoadingMy,
    error: myError,
  } = useMyTickets();

  // Вычисляемые состояния
  const isLoading = viewMode === "available" ? isLoadingAvailable : isLoadingMy;
  const error = viewMode === "available" ? availableError : myError;

  const currentTickets = useMemo(() => {
    const tickets =
      viewMode === "available"
        ? availableData?.items || []
        : myTicketsData || [];

    return tickets;
  }, [viewMode, availableData, myTicketsData]);

  const handleSelectTicket = (ticketId: string) => {
    dispatch(setSelectedTicketId(ticketId));
  };

  return (
    <Flex
      direction="column"
      w="340px"
      h="100vh"
      borderRightWidth="1px"
      borderColor="border.muted"
      bg="bg.panel"
    >
      {/* Header & Navigation */}
      <Box p="4" borderBottomWidth="1px">
        <Heading size="md" mb="4">
          Очередь тикетов
        </Heading>

        <Tabs.Root
          value={viewMode}
          onValueChange={(details) => setViewMode(details.value as ViewMode)}
          variant="plain"
          size="sm"
        >
          <Tabs.List bg="bg.muted" rounded="l3" p="1">
            <Tabs.Trigger value="available" flex="1" justifyContent="center">
              <Inbox size={16} />
              Доступные
              {availableData?.total ? (
                <Badge
                  variant="solid"
                  colorPalette="blue"
                  rounded="full"
                  ms="2"
                >
                  {availableData.total}
                </Badge>
              ) : null}
            </Tabs.Trigger>

            <Tabs.Trigger value="my" flex="1" justifyContent="center">
              <UserCheck size={16} />
              Мои
              {myTicketsData?.length ? (
                <Badge
                  variant="solid"
                  colorPalette="green"
                  rounded="full"
                  ms="2"
                >
                  {myTicketsData.length}
                </Badge>
              ) : null}
            </Tabs.Trigger>
            <Tabs.Indicator rounded="l2" />
          </Tabs.List>
        </Tabs.Root>
      </Box>

      {/* Main Content Area */}
      <Box
        flex="1"
        overflowY="auto"
        bg="bg.subtle" // Более мягкий фон для списка
        p="3"
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": {
            bg: "border.emphasized",
            borderRadius: "full",
          },
        }}
      >
        {isLoading ? (
          <Center h="40">
            <VStack gap="2">
              <Spinner size="sm" color="blue.500" />
              <Text fontSize="xs" color="fg.muted">
                Загрузка...
              </Text>
            </VStack>
          </Center>
        ) : error ? (
          <Center h="40" p="4" textAlign="center">
            <VStack gap="1">
              <Text color="red.500" fontSize="sm" fontWeight="medium">
                Ошибка загрузки
              </Text>
              <Text fontSize="xs" color="fg.subtle">
                {(error as any)?.message}
              </Text>
            </VStack>
          </Center>
        ) : currentTickets.length > 0 ? (
          <VStack gap="3" align="stretch">
            {currentTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                id={ticket.id}
                applicant={ticket.applicant}
                category={ticket.category}
                status={ticket.status}
                priorityValue={ticket.priorityValue}
                isSelected={selectedTicketId === ticket.id}
                onSelect={() => handleSelectTicket(ticket.id)}
                createdAt={ticket.createdAt}
                lastMessageAt={ticket.lastMessageAt}
              />
            ))}
          </VStack>
        ) : (
          <Center h="40">
            <Text fontSize="sm" color="fg.muted">
              {viewMode === "available"
                ? "Нет доступных тикетов"
                : "У вас нет активных тикетов"}
            </Text>
          </Center>
        )}
      </Box>
    </Flex>
  );
};
