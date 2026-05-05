import React, { useEffect, useRef } from "react";
import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { openChat, setActiveChat } from "../model/chatSlice";
import {
  selectMessagesForTicket,
  selectHasMoreMessages,
  selectMessagesLoading,
} from "../model/selectors";
import { chatSocket } from "../api/chatSocket";
import { useTicketMessages } from "../hooks/chatQueries";
import { useTicketDetail } from "@/features/tickets/hooks/queries/useTicketDetail";
import { DeliveryStatus, MessageType } from "../model/types";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";

interface ChatWindowProps {
  ticketId: string;
}

export const ChatWindow = ({ ticketId }: ChatWindowProps) => {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.account.data?.id);
  const messages = useAppSelector((state) =>
    selectMessagesForTicket(state, ticketId),
  );
  const hasMore = useAppSelector((state) =>
    selectHasMoreMessages(state, ticketId),
  );
  const loadingMessages = useAppSelector((state) =>
    selectMessagesLoading(state, ticketId),
  );
  const activeChatId = useAppSelector((state) => state.chat.activeChatId);

  const { data: ticket, isLoading: ticketLoading } = useTicketDetail(ticketId);
  const { fetchNextPage, isFetchingNextPage } = useTicketMessages(ticketId);

  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(0);

  useEffect(() => {
    dispatch(openChat(ticketId));
    chatSocket.joinTicketChat(ticketId);

    return () => {
      chatSocket.leaveTicketChat(ticketId);
      dispatch(setActiveChat(null));
    };
  }, [ticketId, dispatch]);

  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length]);

  useEffect(() => {
    if (activeChatId !== ticketId) return;

    const unreadIds = messages
      .filter(
        (m) =>
          m.authorType !== MessageType.FROM_AGENT ||
          m.authorId !== currentUserId,
      )
      .filter((m) => m.status !== DeliveryStatus.SEEN)
      .map((m) => m.id);

    if (unreadIds.length > 0) {
      chatSocket.markMessagesRead(ticketId, unreadIds);
    }
  }, [activeChatId, ticketId, messages, currentUserId]);

  const isResolved =
    ticket?.status === "RESOLVED" || ticket?.status === "CLOSED";

  if (ticketLoading) {
    return (
      <Flex flex="1" align="center" justify="center">
        <Spinner size="sm" />
      </Flex>
    );
  }

  if (!ticket) return null;

  return (
    <Flex direction="column" flex="1" minH="0" overflow="hidden">
      {/* Список сообщений */}
      <Box flex="1" minH="0" overflowY="auto" py="2">
        {hasMore && (
          <Flex justify="center" py="2">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => fetchNextPage()}
              loading={isFetchingNextPage}
            >
              Загрузить ранее
            </Button>
          </Flex>
        )}

        {loadingMessages && messages.length === 0 ? (
          <Flex justify="center" align="center" h="full">
            <Spinner size="sm" />
          </Flex>
        ) : messages.length === 0 ? (
          <Flex justify="center" align="center" h="full">
            <Text fontSize="sm" color="fg.muted">
              Нет сообщений
            </Text>
          </Flex>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.authorId === currentUserId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </Box>

      <TypingIndicator ticketId={ticketId} />

      <ChatInput ticketId={ticketId} disabled={isResolved} />
    </Flex>
  );
};
