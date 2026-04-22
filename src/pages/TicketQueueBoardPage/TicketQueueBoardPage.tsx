import { TicketCard } from "@/features/tickets/components/TicketCard";
import { useAllQueue } from "@/features/tickets/hooks/queries/useAllQueue";
import { useTicketCounts } from "@/features/tickets/hooks/queries/useTicketCounts";
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
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useCallback, useEffect, useState } from "react";

const COLUMNS = [
  {
    id: "new",
    title: "Новые",
    color: "blue.500",
    status: TicketStatus.NEW,
  },
  {
    id: "in_progress",
    title: "В работе",
    color: "yellow.500",
    status: TicketStatus.IN_PROGRESS,
  },
  {
    id: "escalated",
    title: "Сложные случаи",
    color: "red.500",
    status: TicketStatus.ESCALATED,
  },
  {
    id: "done",
    title: "Завершено",
    color: "green.500",
    status: TicketStatus.CLOSED,
  },
];

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

export const TicketQueueBoardPage = () => {
  const [page, setPage] = useState(1);
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data: ticketsData,
    isLoading,
    error,
    isFetching,
  } = useAllQueue(20, (page - 1) * 20, { isAdmin: true });

  const { data: countsData, isLoading: countsLoading } = useTicketCounts();

  // Обновляем тикеты при получении новых данных
  useEffect(() => {
    if (ticketsData?.items) {
      if (page === 1) {
        setAllTickets(ticketsData.items);
      } else {
        setAllTickets((prev) => [...prev, ...ticketsData.items]);
      }
      setHasMore(ticketsData.items.length === 20);
    }
  }, [ticketsData, page]);

  // Intersection Observer для бесконечной прокрутки
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isFetching && !isLoading) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isFetching, isLoading],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [handleObserver]);

  if (error && page === 1) {
    return (
      <Center h="full" p="6">
        <Text color="red.500">Ошибка загрузки обращений: {error.message}</Text>
      </Center>
    );
  }

  // Анимации для карточек
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  // Функция для получения счетчика по колонке
  const getColumnCount = (status: TicketStatus) => {
    if (!countsData) return 0;

    switch (status) {
      case TicketStatus.NEW:
        return countsData.NEW || 0;
      case TicketStatus.IN_PROGRESS:
        return countsData.IN_PROGRESS || 0;
      case TicketStatus.ESCALATED:
        return countsData.ESCALATED || 0;
      case TicketStatus.CLOSED:
        return countsData.CLOSED || 0;
      default:
        return 0;
    }
  };

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

          const count = getColumnCount(column.status);
          const displayedCount = countsLoading ? "..." : count;

          return (
            <Flex
              key={column.id}
              flexDirection="column"
              h="full"
              bg="bg.soft"
              borderRadius="xl"
              borderWidth="1px"
              overflow="hidden"
            >
              {/* Column Header */}
              <Flex
                p="4"
                bg="bg.pure"
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
                    {displayedCount}
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

              {/* Column Body with Infinite Scroll */}
              <MotionVStack
                flex="1"
                overflowY="auto"
                p="3"
                gap="3"
                align="stretch"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                css={{
                  "&::-webkit-scrollbar": { width: "4px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "gray",
                    borderRadius: "10px",
                  },
                }}
              >
                <AnimatePresence mode="popLayout">
                  {columnApplicants.map((ticket: any, index: number) => (
                    <MotionBox
                      key={ticket.id}
                      position="relative"
                      role="group"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{
                        duration: 0.3,
                        delay: index * 0.02,
                      }}
                    >
                      <TicketCard
                        id={ticket.id}
                        applicant={ticket.applicant}
                        category={ticket.category}
                        status={ticket.status}
                        priorityValue={ticket.priorityValue}
                        isSelected={false}
                        onSelect={(id: string) => {
                          console.log("Selected ticket:", id);
                        }}
                        createdAt={ticket.createdAt}
                        lastMessageAt={ticket.lastMessageAt}
                        firstApplicantMessage={ticket.firstApplicantMessage}
                      />
                    </MotionBox>
                  ))}
                </AnimatePresence>

                {columnApplicants.length === 0 && !isLoading && (
                  <MotionBox
                    h="24"
                    borderWidth="2px"
                    borderStyle="dashed"
                    borderColor="border.subtle"
                    borderRadius="xl"
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                    m="2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Text fontSize="sm" color="fg.muted" textAlign="center">
                      Нет обращений
                    </Text>
                  </MotionBox>
                )}

                {/* Индикатор загрузки для бесконечной прокрутки */}
                {isFetching && columnApplicants.length > 0 && (
                  <MotionBox
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    p="3"
                    textAlign="center"
                  >
                    <Spinner size="sm" color={column.color} />
                    <Text fontSize="xs" color="fg.muted" mt="1">
                      Загрузка...
                    </Text>
                  </MotionBox>
                )}

                {/* Элемент для отслеживания прокрутки */}
                {column.id === COLUMNS[0].id && hasMore && (
                  <Box ref={loadMoreRef} h="20px" />
                )}
              </MotionVStack>
            </Flex>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TicketQueueBoardPage;
