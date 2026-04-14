import React, { useRef } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { ChevronDown, Send } from "lucide-react";
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
    <Box
      px="3"
      py="3"
      borderTopWidth="1px"
      borderColor="border.muted"
      flexShrink={0}
    >
      <Box
        position="relative"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="border.muted"
        bg="bg.subtle"
        overflow="hidden"
        boxShadow="sm"
        transition="all 0.2s"
        _focusWithin={{
          borderColor: "blue.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-blue-100)",
        }}
      >
        <Textarea
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение... (Нажмите '/' для вызова шаблонов)"
          resize="none"
          rows={3}
          bg="transparent"
          border="none"
          outline="none"
          boxShadow="none"
          _focus={{ boxShadow: "none" }}
          _focusVisible={{ boxShadow: "none" }}
          fontSize="sm"
          fontWeight="medium"
          color="fg"
          _placeholder={{ color: "fg.subtle" }}
          pb="10"
          disabled={disabled || isPending}
          css={{ overflow: "auto" }}
        />

        <Flex
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          align="center"
          justify="space-between"
          px="3"
          py="1.5"
          borderTopWidth="1px"
          borderColor="border.muted"
          bg="bg"
        >
          <Flex gap="2">
            <Button
              size="xs"
              variant="outline"
              colorPalette="gray"
              fontWeight="semibold"
            >
              <Text color="fg.muted" fontSize="xs">
                /
              </Text>
              Шаблоны
              <ChevronDown size={13} />
            </Button>
            <Button
              size="xs"
              variant="outline"
              colorPalette="gray"
              fontWeight="semibold"
            >
              <Text color="fg.muted" fontSize="xs">
                {"{ }"}
              </Text>
              Переменные
              <ChevronDown size={13} />
            </Button>
          </Flex>

          <IconButton
            aria-label="Отправить"
            onClick={handleSubmit}
            disabled={!content.trim() || isPending || disabled}
            borderRadius="lg"
            size="sm"
          >
            <Send size={16} />
          </IconButton>
        </Flex>
      </Box>
    </Box>
  );
};
