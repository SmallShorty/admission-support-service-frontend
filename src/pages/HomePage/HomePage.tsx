import { Box, Heading, Button, HStack } from "@chakra-ui/react";

const HomePage = () => {
  return (
    <Box>
      <Heading mb={4}>Добро пожаловать в систему приема абитуриентов</Heading>
      <HStack>
        <Button>Click me</Button>
        <Button>Click me</Button>
      </HStack>
    </Box>
  );
};

export default HomePage;
