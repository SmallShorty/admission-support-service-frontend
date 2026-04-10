import { Box, Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

const Layout = () => {
  return (
    <Box bg="#F9FBFB" h="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Container maxW="container.xl" px="0" mx="0" flex="1" minH="0" overflow="hidden">
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
