import { FC, ReactNode } from "react";
import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import { Info } from "lucide-react";
import { Panel } from "./panel";
import { Tooltip } from "./tooltip";

interface SectionCardProps extends BoxProps {
  icon: ReactNode;
  title: string;
  description?: string;
  tooltip?: string;
  colorScheme?: string;
  children?: ReactNode;
}

export const SectionCard: FC<SectionCardProps> = ({
  icon,
  title,
  description,
  tooltip,
  colorScheme = "gray",
  children,
  ...rest
}) => {
  return (
    <Panel borderWidth="1px" borderColor="border.subtle" overflow="hidden" {...rest}>
      <Flex
        align="flex-start"
        justify="space-between"
        px="4"
        pt="4"
        pb="3"
        bg="gray.50"
        _dark={{ bg: "whiteAlpha.50" }}
        borderBottomWidth={children ? "1px" : "0"}
        borderBottomColor="border.subtle"
      >
        <Flex align="center" gap="3">
          <Flex
            align="center"
            justify="center"
            p="2"
            borderRadius="lg"
            bg={`${colorScheme}.50`}
            borderWidth="1px"
            borderColor={`${colorScheme}.200`}
            color={`${colorScheme}.600`}
            _dark={{ bg: `${colorScheme}.900`, borderColor: `${colorScheme}.800`, color: `${colorScheme}.300` }}
            flexShrink={0}
          >
            {icon}
          </Flex>
          <Box>
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="fg.default"
              textTransform="uppercase"
              letterSpacing="wider"
              lineHeight="1.2"
            >
              {title}
            </Text>
            {description && (
              <Text fontSize="xs" color="fg.muted">
                {description}
              </Text>
            )}
          </Box>
        </Flex>

        {tooltip ? (
          <Tooltip showArrow content={tooltip} openDelay={200} positioning={{ placement: "top-end" }}>
            <IconButton
              variant="ghost"
              size="xs"
              aria-label="Информация"
              color="fg.subtle"
              flexShrink={0}
              mt="-0.5"
            >
              <Info size={14} />
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton
            variant="ghost"
            size="xs"
            aria-label="Информация"
            color="fg.subtle"
            flexShrink={0}
            mt="-0.5"
          >
            <Info size={14} />
          </IconButton>
        )}
      </Flex>

      {children && (
        <Box px="4" pb="4" pt="3">
          {children}
        </Box>
      )}
    </Panel>
  );
};
