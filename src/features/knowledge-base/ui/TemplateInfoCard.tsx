import { JSONContent } from "@tiptap/core";
import { Template } from "@/features/templates/model/types";
import { Box, Flex, Text, Badge, Icon } from "@chakra-ui/react";
import { LuUser, LuClock } from "react-icons/lu";

interface Props {
  template: Template;
  onClick: () => void;
}

const extractText = (node: JSONContent): string => {
  if (node.type === "text") return node.text ?? "";
  return (node.content ?? []).map(extractText).join("");
};

export const TemplateInfoCard = ({ template, onClick }: Props) => {

  return (
    <Box
      bg="bg.panel"
      p="5"
      rounded="xl"
      borderWidth="1px"
      borderColor="border.subtle"
      display="flex"
      flexDirection="column"
      cursor="pointer"
      onClick={onClick}
      _hover={{ borderColor: "blue.300", shadow: "sm" }}
      transition="all 0.15s"
    >
      <Flex justify="space-between" align="start" mb="3" gap="4">
        <Box minW="0" flex="1">
          <Flex align="center" gap="2" mb="1.5" wrap="wrap">
            <Text fontWeight="semibold" color="fg.default" truncate>
              {template.title}
            </Text>
            <Badge
              variant="subtle"
              size="sm"
              display="flex"
              alignItems="center"
              gap="1"
              px="2"
              py="0.5"
              rounded="full"
              textTransform="none"
              fontSize="10px"
            >
              <Icon as={LuUser} />
              {template.createdBy}
            </Badge>
          </Flex>
          <Flex align="center" gap="1.5" color="fg.muted" fontSize="11px">
            <Icon as={LuClock} />
            <Text>Обновлено: {template.updatedAt}</Text>
          </Flex>
        </Box>

        <Badge
          fontFamily="mono"
          fontSize="xs"
          fontWeight="bold"
          colorPalette="blue"
          variant="surface"
          px="2.5"
          py="1.5"
          rounded="md"
        >
          /{template.alias}
        </Badge>
      </Flex>

      <Box
        bg="bg.muted"
        p="3.5"
        rounded="lg"
        fontSize="13px"
        color="fg.emphasized"
        fontFamily="mono"
        lineHeight="relaxed"
        whiteSpace="pre-wrap"
        borderWidth="1px"
        borderColor="border.subtle"
        flex="1"
        transition="colors"
      >
        {extractText(template.content)}
      </Box>
    </Box>
  );
};
