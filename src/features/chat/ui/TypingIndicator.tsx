import { Flex, Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/app/hooks";
import { selectHasTypingUsers } from "../model/selectors";

const MotionBox = motion.create(Box);

const dotVariants = {
  initial: { y: 0, opacity: 0.4 },
  animate: { y: -4, opacity: 1 },
};

interface TypingIndicatorProps {
  ticketId: string;
}

export const TypingIndicator = ({ ticketId }: TypingIndicatorProps) => {
  const hasTyping = useAppSelector((state) =>
    selectHasTypingUsers(state, ticketId),
  );

  if (!hasTyping) return null;

  return (
    <Flex align="center" gap="2" px="4" py="1">
      <Flex gap="1" align="center">
        {[0, 1, 2].map((i) => (
          <MotionBox
            key={i}
            w="6px"
            h="6px"
            borderRadius="full"
            bg="fg.muted"
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.15,
            }}
          />
        ))}
      </Flex>
      <Text fontSize="xs" color="fg.muted">
        печатает...
      </Text>
    </Flex>
  );
};
