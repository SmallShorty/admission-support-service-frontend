import { selectAccount } from "@/app/entities/account/model/selectors";
import { useAppSelector } from "@/app/hooks";
import { Box, Heading, Button, HStack } from "@chakra-ui/react";

const HomePage = () => {
  const account = useAppSelector(selectAccount);

  if (!account) return null;

  return (
    <Box>
      <Heading size="lg">Добро пожаловать, {account.firstName}!</Heading>
    </Box>
  );
};

export default HomePage;
