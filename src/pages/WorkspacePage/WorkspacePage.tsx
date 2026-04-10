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
    <Grid templateColumns="300px 1fr 350px" h="full" overflow="hidden">
      <SidebarTicketQueue />

      {/* Chat area */}
      <Flex
        direction="column"
        h="full"
        overflow="hidden"
        borderLeftWidth="1px"
        borderColor="border.muted"
      >
        {selectedTicketId ? (
          <ChatWindow key={selectedTicketId} ticketId={selectedTicketId} />
        ) : (
          <Flex flex="1" align="center" justify="center">
            <Text fontSize="sm" color="fg.muted">
              Выберите тикет для начала чата
            </Text>
          </Flex>
        )}
      </Flex>

      {/* Detail panel */}
      <Flex
        direction="column"
        h="full"
        overflow="hidden"
        borderLeftWidth="1px"
        borderColor="border.muted"
      >
        {selectedTicketId ? (
          <TicketDetailPanel
            key={selectedTicketId}
            ticketId={selectedTicketId}
          />
        ) : (
          <Flex flex="1" align="center" justify="center">
            <Text fontSize="sm" color="fg.muted">
              Информация о тикете
            </Text>
          </Flex>
        )}
      </Flex>
    </Grid>
  );
};

export default WorkspacePage;
