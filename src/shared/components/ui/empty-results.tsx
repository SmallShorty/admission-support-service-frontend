import { FC, ReactNode } from "react";
import { Center, Flex, Text } from "@chakra-ui/react";
import { SearchX } from "lucide-react";

interface EmptyResultsProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  py?: string | number;
}

export const EmptyResults: FC<EmptyResultsProps> = ({
  title = "Ничего не найдено",
  description,
  icon,
  py = "16",
}) => {
  return (
    <Center py={py}>
      <Flex direction="column" align="center" gap="3" color="fg.muted" textAlign="center">
        <Flex
          align="center"
          justify="center"
          p="3"
          borderRadius="xl"
          bg="bg.subtle"
          borderWidth="1px"
          borderColor="border.subtle"
        >
          {icon ?? <SearchX size={24} />}
        </Flex>
        <Flex direction="column" gap="1">
          <Text fontWeight="medium" color="fg.default">
            {title}
          </Text>
          {description && (
            <Text fontSize="sm">{description}</Text>
          )}
        </Flex>
      </Flex>
    </Center>
  );
};
