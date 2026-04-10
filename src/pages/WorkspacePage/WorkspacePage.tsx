import { Flex, Grid, Text } from "@chakra-ui/react";
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
    <Grid templateColumns="340px 1fr 340px" h="full" overflow="hidden">
      <SidebarTicketQueue />

      {selectedTicketId ? (
        <ChatWindow key={selectedTicketId} ticketId={selectedTicketId} />
      ) : (
        <Flex align="center" justify="center" gridColumn="span 2">
          <Text fontSize="sm" color="fg.muted">
            Выберите тикет для начала чата
          </Text>
        </Flex>
      )}

      {selectedTicketId && (
        <TicketDetailPanel key={selectedTicketId} ticketId={selectedTicketId} />
      )}
    </Grid>
  );
};

export default WorkspacePage;
