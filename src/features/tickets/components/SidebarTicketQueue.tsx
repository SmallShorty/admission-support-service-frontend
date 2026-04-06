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
} from "@chakra-ui/react";
import { Search, FilterX } from "lucide-react";
import { TicketCard } from "./TicketCard";
import { AdmissionIntentCategory, TicketStatus } from "../model/types";

const MOCK_TICKETS = [
  {
    applicant: {
      id: "user-1",
      name: "Иван Иванов",
      firstName: "Иван",
      lastName: "Иванов",
    },
    category: AdmissionIntentCategory.TECHNICAL_ISSUES,
    status: TicketStatus.IN_PROGRESS,
    priorityValue: 9,
  },
  {
    applicant: {
      id: "user-2",
      name: "Мария Петрова",
      firstName: "Мария",
      lastName: "Петрова",
      middleName: "Сергеевна",
    },
    category: AdmissionIntentCategory.DOCUMENT_SUBMISSION,
    status: TicketStatus.NEW,
    priorityValue: 10, // Срочный новый тикет
  },
  {
    applicant: {
      id: "user-4",
      name: "Анна Кузнецова",
      firstName: "Анна",
      lastName: "Кузнецова",
    },
    category: AdmissionIntentCategory.PAYMENTS_CONTRACTS,
    status: TicketStatus.AWAITING_FEEDBACK,
    priorityValue: 5,
  },
  {
    applicant: {
      id: "user-5",
      name: "Дмитрий Волков",
      firstName: "Дмитрий",
      lastName: "Волков",
    },
    category: AdmissionIntentCategory.GENERAL_INFO,
    status: TicketStatus.RESOLVED,
    priorityValue: 2,
  },
  {
    applicant: {
      id: "user-6",
      name: "Елена Соколова",
      firstName: "Елена",
      lastName: "Соколова",
    },
    category: AdmissionIntentCategory.STATUS_VERIFICATION,
    status: TicketStatus.CLOSED,
    priorityValue: 1,
  },
];

export const SidebarTicketQueue = () => {
  const [selectedId, setSelectedId] = useState<string>("user-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [hideInactive, setHideInactive] = useState(false);

  const filteredTickets = useMemo(() => {
    return MOCK_TICKETS.filter((t) => {
      const matchesSearch =
        t.applicant.lastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        t.applicant.firstName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = hideInactive
        ? t.status === TicketStatus.IN_PROGRESS
        : true;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => b.priorityValue - a.priorityValue);
  }, [searchQuery, hideInactive]);

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
        <Flex align="center" justify="space-between">
          <Heading size="md">Очередь</Heading>
        </Flex>
      </Box>

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
        bg={"#F9FBFB"}
      >
        <VStack gap="3" align="stretch">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.applicant.id}
                applicant={ticket.applicant}
                category={ticket.category}
                status={ticket.status}
                priorityValue={ticket.priorityValue}
                isSelected={selectedId === ticket.applicant.id}
                onSelect={(id) => setSelectedId(id)}
                createdAt={"24.05.2026"}
                lastMessageAt={"24.05.2026 10:20"}
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
              <Text fontSize="sm">Никого не нашли</Text>
            </Flex>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};
