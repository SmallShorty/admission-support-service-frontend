import { Box, Container } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";

const NO_PADDING_PATHS = ["/workspace", "/queue"];

const Layout = () => {
  const { pathname } = useLocation();
  const noPadding = NO_PADDING_PATHS.includes(pathname);

  return (
    <Box bg="mainBg" height="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Container
        maxW="full"
        p={noPadding ? "0" : { base: "4", md: "6", lg: "8" }}
        mx="0"
        flex="1"
        minH="0"
        overflowY="auto"
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
