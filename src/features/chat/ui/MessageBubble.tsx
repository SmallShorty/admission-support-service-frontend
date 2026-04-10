import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { Check, CheckCheck } from "lucide-react";
import { TicketMessage, MessageType, DeliveryStatus } from "../model/types";

interface MessageBubbleProps {
  message: TicketMessage;
  isOwnMessage: boolean;
}

const formatTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const MessageBubble = ({
  message,
  isOwnMessage,
}: MessageBubbleProps) => {
  if (message.authorType === MessageType.SYSTEM) {
    return (
      <Flex justify="center" my="1">
        <Box px="3" py="1" borderRadius="full" bg="bg.muted" maxW="80%">
          <Text fontSize="xs" color="fg.muted" textAlign="center">
            {message.content}
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex justify={isOwnMessage ? "flex-end" : "flex-start"} mb="1" px="2">
      <Box maxW="72%">
        {!isOwnMessage && (
          <Text fontSize="11px" color="fg.muted" mb="0.5" ml="1">
            {message.author.firstName}
          </Text>
        )}
        <Box
          px="3"
          py="2"
          borderRadius="xl"
          borderBottomRightRadius={isOwnMessage ? "sm" : "xl"}
          borderBottomLeftRadius={isOwnMessage ? "xl" : "sm"}
          bg={isOwnMessage ? "colorPalette.solid" : "white"}
          colorPalette="teal"
          boxShadow="sm"
        >
          <Text
            fontSize="sm"
            color={isOwnMessage ? "white" : "fg"}
            whiteSpace="pre-wrap"
            wordBreak="break-word"
          >
            {message.content}
          </Text>
        </Box>
        <Flex
          align="center"
          gap="1"
          mt="0.5"
          justify={isOwnMessage ? "flex-end" : "flex-start"}
          px="1"
        >
          <Text fontSize="10px" color="fg.muted">
            {formatTime(message.createdAt)}
          </Text>
          {isOwnMessage && (
            <Icon
              color={
                message.status === DeliveryStatus.SEEN ? "teal.400" : "fg.muted"
              }
              boxSize="3"
            >
              {message.status === DeliveryStatus.SEEN ? (
                <CheckCheck size={12} />
              ) : (
                <Check size={12} />
              )}
            </Icon>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};
