import { Box, Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

const Layout = () => {
  return (
    <Box bg="#F9FBFB" minH="100vh">
      <Navbar />
      <Container maxW="container.xl">
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
