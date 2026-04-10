import React, { useRef } from "react";
import { Box, Flex, IconButton, Textarea } from "@chakra-ui/react";
import { Send } from "lucide-react";
import { chatSocket } from "../api/chatSocket";
import { useSendMessage } from "../hooks/chatQueries";

interface ChatInputProps {
  ticketId: string;
  disabled?: boolean;
}

export const ChatInput = ({ ticketId, disabled = false }: ChatInputProps) => {
  const [content, setContent] = React.useState("");
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const { mutate: sendMessage, isPending } = useSendMessage();

  const stopTyping = () => {
    if (isTypingRef.current) {
      chatSocket.sendTypingStatus(ticketId, false);
      isTypingRef.current = false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    if (!isTypingRef.current) {
      chatSocket.sendTypingStatus(ticketId, true);
      isTypingRef.current = true;
    }

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(stopTyping, 2000);
  };

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed || isPending || disabled) return;

    stopTyping();
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    sendMessage({ ticketId, content: trimmed });
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box px="3" py="3" borderTopWidth="1px" borderColor="border.muted" flexShrink={0}>
      <Flex gap="2" align="flex-end">
        <Textarea
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Напишите сообщение..."
          resize="none"
          rows={1}
          maxH="120px"
          flex="1"
          disabled={disabled || isPending}
          borderRadius="xl"
          fontSize="sm"
          css={{ overflow: "auto" }}
        />
        <IconButton
          aria-label="Отправить"
          onClick={handleSubmit}
          disabled={!content.trim() || isPending || disabled}
          colorPalette="blue"
          borderRadius="xl"
          size="md"
          flexShrink={0}
        >
          <Send size={16} />
        </IconButton>
      </Flex>
    </Box>
  );
};
