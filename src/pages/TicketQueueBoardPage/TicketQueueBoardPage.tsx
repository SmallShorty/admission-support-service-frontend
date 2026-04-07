import { TicketCard } from "@/features/tickets/components/TicketCard";
import { useAllQueue } from "@/features/tickets/hooks/queries/useAllQueue";
import { TicketStatus } from "@/features/tickets/model/types";
import {
  Box,
  Circle,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  VStack,
  Text,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { MoreHorizontal } from "lucide-react";

const COLUMNS = [
  { id: "new", title: "Новые", color: "blue.500", status: TicketStatus.NEW },
  {
    id: "in_progress",
    title: "В работе",
    color: "yellow.500",
    status: TicketStatus.IN_PROGRESS,
  },
  {
    id: "review",
    title: "На проверке",
    color: "purple.500",
    status: TicketStatus.ESCALATED,
  },
  {
    id: "done",
    title: "Завершено",
    color: "green.500",
    status: TicketStatus.CLOSED,
  },
];

export const TicketQueueBoardPage = () => {
  const {
    data: ticketsData,
    isLoading,
    error,
  } = useAllQueue(50, 0, { isAdmin: true });

  const allTickets = ticketsData?.items || [];

  if (isLoading) {
    return (
      <Center h="full" p="6">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="full" p="6">
        <Text color="red.500">Ошибка загрузки обращений: {error.message}</Text>
      </Center>
    );
  }

  return (
    <Box flex="1" overflowX="auto" p="6" h="full">
      <Grid
        templateColumns="repeat(4, 1fr)"
        gap="6"
        h="full"
        minW="1000px"
        w="full"
      >
        {COLUMNS.map((column) => {
          const columnApplicants = allTickets
            .filter((ticket: any) => ticket.status === column.status)
            .sort(
              (a: any, b: any) =>
                (b.priorityValue || 0) - (a.priorityValue || 0),
            );

          return (
            <Flex
              key={column.id}
              flexDirection="column"
              h="full"
              bg="bg.muted"
              borderRadius="xl"
              borderWidth="1px"
              overflow="hidden"
            >
              {/* Column Header */}
              <Flex
                p="4"
                bg="bg.muted/80"
                borderBottomWidth="1px"
                align="center"
                justify="space-between"
                flexShrink={0}
              >
                <HStack gap="2.5">
                  <Circle size="2.5" bg={column.color} />
                  <Heading
                    size="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    color="fg.emphasized"
                  >
                    {column.title}
                  </Heading>
                  <Box
                    fontSize="xs"
                    fontWeight="medium"
                    px="2"
                    py="0.5"
                    bg="bg.subtle"
                    borderRadius="full"
                    color="fg.muted"
                  >
                    {columnApplicants.length}
                  </Box>
                </HStack>
                <IconButton
                  variant="ghost"
                  size="xs"
                  color="fg.muted"
                  _hover={{ bg: "bg.emphasized" }}
                  aria-label="More options"
                >
                  <MoreHorizontal size={18} />
                </IconButton>
              </Flex>

              {/* Column Body */}
              <VStack
                flex="1"
                overflowY="auto"
                p="3"
                gap="3"
                align="stretch"
                css={{
                  "&::-webkit-scrollbar": { width: "4px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "gray",
                    borderRadius: "10px",
                  },
                }}
              >
                {columnApplicants.map((ticket: any) => (
                  <Box key={ticket.id} position="relative" role="group">
                    <TicketCard
                      id={ticket.id}
                      applicant={ticket.applicant}
                      category={ticket.category}
                      status={ticket.status}
                      priorityValue={ticket.priorityValue}
                      isSelected={false}
                      onSelect={(id: string) => {
                        // Implement selection logic if needed
                        console.log("Selected ticket:", id);
                      }}
                      createdAt={ticket.createdAt}
                      lastMessageAt={ticket.lastMessageAt}
                    />
                  </Box>
                ))}

                {columnApplicants.length === 0 && (
                  <Flex
                    h="24"
                    borderWidth="2px"
                    borderStyle="dashed"
                    borderColor="border.subtle"
                    borderRadius="xl"
                    align="center"
                    justify="center"
                    m="2"
                  >
                    <Text fontSize="sm" color="fg.muted">
                      Нет обращений
                    </Text>
                  </Flex>
                )}
              </VStack>
            </Flex>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TicketQueueBoardPage;
