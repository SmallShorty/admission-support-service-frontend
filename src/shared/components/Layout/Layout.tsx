import { Box, Flex } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useAppSelector } from "@/app/store/hooks";
import { useNotificationWebSocket } from "@/features/integrations/hooks/websockets/useNotificationWebSocket";

const NO_PADDING_PATHS = ["/workspace", "/queue"];

const Layout = () => {
  const { pathname } = useLocation();
  const noPadding = NO_PADDING_PATHS.includes(pathname);
  const accessToken = useAppSelector((state) => state.account.accessToken);
  const isAuth = useAppSelector((state) => state.account.isAuth);

  useNotificationWebSocket(accessToken, isAuth);

  return (
    <Flex direction="column" h="100vh" bg="mainBg" overflow="hidden">
      <Navbar />
      <Box
        flex="1"
        minH="0"
        overflow="hidden"
        p={noPadding ? "0" : { base: "4", md: "6", lg: "8" }}
      >
        <Outlet />
      </Box>
    </Flex>
  );
};

export default Layout;
