import { Box, Center, Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const BareLayout = () => {
  return (
    <Center bg="#F9FBFB" minH="100vh">
      <Outlet />
    </Center>
  );
};

export default BareLayout;
