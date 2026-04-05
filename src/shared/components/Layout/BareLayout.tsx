import { Box, Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const BareLayout = () => {
  return (
    <Box>
      <Container maxW="container.xl" py={8}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default BareLayout;
