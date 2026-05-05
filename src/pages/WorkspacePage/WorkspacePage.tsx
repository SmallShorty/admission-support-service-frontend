import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useAppSelector } from "@/app/hooks";
import { SidebarTicketQueue } from "@/features/tickets/components/SidebarTicketQueue";
import { ChatWindow } from "@/features/chat/ui/ChatWindow";
import { TicketDetailPanel } from "@/features/tickets/ui/TicketDetailPanel";
import { useChatConnection } from "@/features/chat/hooks/chatQueries";
import { useTicketWebSocket } from "@/features/tickets/hooks/websockets/useTicketWebSocket";

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
      templateColumns="340px 1fr 340px"
      h="100%"
      overflow="hidden"
      borderTopWidth="1px"
      borderColor="border.muted"
    >
      {/* Колонка 1: очередь заявок */}
      <Box overflow="hidden" borderRightWidth="1px" borderColor="border.muted">
        <SidebarTicketQueue />
      </Box>

      {/* Колонка 2: чат */}
      {selectedTicketId ? (
        <Flex direction="column" overflow="hidden" key={`chat-${selectedTicketId}`}>
          <ChatWindow ticketId={selectedTicketId} />
        </Flex>
      ) : (
        <Flex align="center" justify="center">
          <Text fontSize="sm" color="fg.muted">
            Выберите заявку для начала чата
          </Text>
        </Flex>
      )}

      {/* Колонка 3: детали заявки */}
      <Box
        overflow="hidden"
        borderLeftWidth="1px"
        borderColor="border.muted"
        key={selectedTicketId ? `detail-${selectedTicketId}` : "detail-empty"}
      >
        {selectedTicketId ? (
          <TicketDetailPanel ticketId={selectedTicketId} />
        ) : null}
      </Box>
    </Grid>
  );
};

export default WorkspacePage;
