import { FC } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Center,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Stack,
} from "@chakra-ui/react";

const NotFoundPage: FC = () => {
  const navigate = useNavigate();

  return (
    <VStack
      maxW="md"
      textAlign="center"
      p={8}
      bg="white"
      borderRadius="xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.200"
      gap={6}
    >
      {/* Иконка поиска
        <Circle size="20" bg="blue.50" color="blue.600">
          <SearchX size={36} style={{ opacity: 0.8 }} />
        </Circle> */}

      <Box w="full">
        <Heading
          size="2xl"
          fontWeight="bold"
          color="gray.900"
          letterSpacing="tight"
          mb={2}
        >
          404
        </Heading>

        <Heading
          as="h2"
          size="lg"
          fontWeight="semibold"
          color="gray.800"
          mb={3}
        >
          Страница не найдена
        </Heading>

        <Text color="gray.600" fontSize="md">
          Запрашиваемая вами страница была перемещена, удалена или временно
          недоступна. Пожалуйста, проверьте правильность адреса.
        </Text>
      </Box>

      {/* Кнопки навигации */}
      <Stack
        direction={{ base: "column", sm: "row" }}
        w="full"
        gap={3}
        justify="center"
      >
        <Button
          variant="outline"
          colorScheme="gray"
          flex="1"
          onClick={() => navigate(-1)}
        >
          <HStack gap={2}>
            <Text>Назад</Text>
          </HStack>
        </Button>

        <Button
          variant="solid"
          colorScheme="blue" // или ваш основной цвет 'aspa-brand'
          flex="1"
          onClick={() => navigate("/")}
        >
          <HStack gap={2}>
            <Text>На главную</Text>
          </HStack>
        </Button>
      </Stack>
    </VStack>
  );
};

export default NotFoundPage;
