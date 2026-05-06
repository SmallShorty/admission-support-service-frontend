import { Box, Center, Flex, Grid, Text } from "@chakra-ui/react";
import { useAppSelector } from "@/app/hooks";
import { SidebarTicketQueue } from "@/features/tickets/components/SidebarTicketQueue";
import { ChatWindow } from "@/features/chat/ui/ChatWindow";
import { TicketDetailPanel } from "@/features/tickets/ui/TicketDetailPanel";
import { useChatConnection } from "@/features/chat/hooks/chatQueries";
import { useTicketWebSocket } from "@/features/tickets/hooks/websockets/useTicketWebSocket";
import { Inbox } from "lucide-react";

const WorkspacePage = () => {
  const selectedTicketId = useAppSelector(
    (state) => state.tickets.selectedTicketId,
  );
  const accessToken = useAppSelector((state) => state.account.accessToken);
  const isAuth = useAppSelector((state) => state.account.isAuth);

  useChatConnection();
  useTicketWebSocket(accessToken, isAuth);

  return (
    <Grid
      templateColumns="340px 560px 1fr"
      h="100%"
      overflow="hidden"
      borderTopWidth="1px"
      borderColor="border.muted"
    >
      {/* Колонка 1: очередь заявок */}
      <Box overflow="hidden" borderRightWidth="1px" borderColor="border.muted">
        <SidebarTicketQueue />
      </Box>

      {selectedTicketId ? (
        <>
          {/* Колонка 2: детали заявки / информация об абитуриенте */}
          <Box
            overflow="hidden"
            borderRightWidth="1px"
            borderColor="border.muted"
            key={`detail-${selectedTicketId}`}
          >
            <TicketDetailPanel ticketId={selectedTicketId} />
          </Box>

          {/* Колонка 3: чат */}
          <Flex
            direction="column"
            overflow="hidden"
            key={`chat-${selectedTicketId}`}
          >
            <ChatWindow ticketId={selectedTicketId} />
          </Flex>
        </>
      ) : (
        <Center gridColumn="2 / -1" h="100%">
          <Flex direction="column" align="center" gap="3" textAlign="center">
            <Flex
              align="center"
              justify="center"
              p="4"
              borderRadius="xl"
              bg="bg.subtle"
              borderWidth="1px"
              borderColor="fg.default"
            >
              <Inbox size={32} color="var(--chakra-colors-fg-muted)" />
            </Flex>
            <Text fontWeight="medium" fontSize="md" color="fg.default">
              Выберите заявку
            </Text>
            <Text fontSize="sm" color="fg.muted">
              Выберите заявку из очереди, чтобы начать работу
            </Text>
          </Flex>
        </Center>
      )}
    </Grid>
  );
};

export default WorkspacePage;
