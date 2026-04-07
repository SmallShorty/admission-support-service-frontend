import React, { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  IconButton,
  HStack,
  Input,
  Text,
  Button,
  Badge,
} from "@chakra-ui/react";
import { Search, FilterX, Users, UserCheck } from "lucide-react";
import { TicketCard } from "./TicketCard";
import { AdmissionIntentCategory, TicketStatus } from "../model/types";
import { useAvailableQueue } from "../hooks/queries/useAvailableQueue";
import { useMyTickets } from "../hooks/queries/useMyTickets";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setSelectedTicketId } from "../model/ticketsSlice";

export const SidebarTicketQueue = () => {
  const dispatch = useAppDispatch();
  const selectedTicketId = useAppSelector(
    (state) => state.tickets.selectedTicketId,
  );
  const [viewMode, setViewMode] = useState<"available" | "my">("available");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data based on view mode
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

  // Get current data and loading state
  const isLoading = viewMode === "available" ? isLoadingAvailable : isLoadingMy;
  const error = viewMode === "available" ? availableError : myError;
  const tickets =
    viewMode === "available" ? availableData?.items || [] : myTicketsData || [];

  // Filter tickets by search term
  const filteredTickets = useMemo(() => {
    if (!searchTerm.trim()) return tickets;

    return tickets.filter((ticket) =>
      ticket.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [tickets, searchTerm]);

  const handleSelectTicket = (ticketId: string) => {
    dispatch(setSelectedTicketId(ticketId));
  };

  // Render loading state
  if (isLoading) {
    return (
      <Flex
        direction="column"
        w="340px"
        h="100vh"
        borderRightWidth="1px"
        borderColor="gray.200"
      >
        <Box p="4" bg="bg.panel" borderBottomWidth="1px">
          <Heading size="md">Очередь</Heading>
        </Box>
        <Flex flex="1" align="center" justify="center">
          <Text>Загрузка...</Text>
        </Flex>
      </Flex>
    );
  }

  // Render error state
  if (error) {
    return (
      <Flex
        direction="column"
        w="340px"
        h="100vh"
        borderRightWidth="1px"
        borderColor="gray.200"
      >
        <Box p="4" bg="bg.panel" borderBottomWidth="1px">
          <Heading size="md">Очередь</Heading>
        </Box>
        <Flex
          flex="1"
          align="center"
          justify="center"
          direction="column"
          gap="3"
        >
          <Text color="red.500">Ошибка загрузки</Text>
          <Text fontSize="sm" color="gray.500">
            {error.message}
          </Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      w="340px"
      h="100vh"
      borderRightWidth="1px"
      borderColor="gray.200"
    >
      {/* Header */}
      <Box p="4" bg="bg.panel" borderBottomWidth="1px">
        <Heading size="md" mb="3">
          Очередь тикетов
        </Heading>

        {/* Mode Toggle Buttons */}
        <HStack gap="2" mb="4">
          <Button
            size="sm"
            variant={viewMode === "available" ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => setViewMode("available")}
            flex="1"
          >
            Доступные
            {availableData?.total !== undefined && availableData.total > 0 && (
              <Badge ml="2" colorScheme="blue" borderRadius="full">
                {availableData.total}
              </Badge>
            )}
          </Button>
          <Button
            size="sm"
            variant={viewMode === "my" ? "solid" : "outline"}
            colorScheme="green"
            onClick={() => setViewMode("my")}
            flex="1"
          >
            Мои тикеты
            {myTicketsData && myTicketsData.length > 0 && (
              <Badge ml="2" colorScheme="green" borderRadius="full">
                {myTicketsData.length}
              </Badge>
            )}
          </Button>
        </HStack>
      </Box>

      {/* Ticket List */}
      <Box
        flex="1"
        overflowY="auto"
        p="3"
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": {
            bg: "border.emphasized",
            borderRadius: "full",
          },
        }}
        bg="#F9FBFB"
      >
        <VStack gap="3" align="stretch">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
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
            ))
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              py="10"
              color="fg.muted"
            >
              <Text fontSize="sm">
                {searchTerm
                  ? "Ничего не найдено"
                  : viewMode === "available"
                    ? "Нет доступных тикетов"
                    : "У вас нет активных тикетов"}
              </Text>
            </Flex>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};
