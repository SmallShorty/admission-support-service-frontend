import { Template } from "@/features/templates/model/types";
import { Box, Flex, Text, Badge, Stack, Icon } from "@chakra-ui/react";
import { LuUser, LuClock } from "react-icons/lu";

interface Props {
  template: Template;
}

export const TemplateInfoCard = ({ template }: Props) => {
  const renderContent = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      return parsed.content || jsonStr;
    } catch {
      return jsonStr;
    }
  };

  return (
    <Box
      bg="bg.panel"
      p="5"
      rounded="xl"
      borderWidth="1px"
      borderColor="border.subtle"
      display="flex"
      flexDirection="column"
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
              {template.authorName}
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
        {renderContent(template.content)}
      </Box>
    </Box>
  );
};
