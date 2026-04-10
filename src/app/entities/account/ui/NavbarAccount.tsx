import {
  Avatar,
  Box,
  Circle,
  Float,
  Menu,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC } from "react";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";
import { selectAccount } from "../model/selectors";

interface NavbarAccountProps {
  onLogout: () => void;
}

export const NavbarAccount: FC<NavbarAccountProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const user = useAppSelector(selectAccount);

  if (!user) return null;

  return (
    <Menu.Root
      positioning={{ placement: "bottom-end" }}
      onSelect={(details) => {
        if (details.value === "profile") navigate("/profile");
        if (details.value === "logout") onLogout();
      }}
    >
      <Menu.Trigger asChild>
        <Box
          as="button"
          display="flex"
          alignItems="center"
          gap="3"
          px="2"
          py="1"
          borderRadius="lg"
          transition="background 0.2s"
          _hover={{ bg: "gray.50" }}
          outline="none"
        >
          <Box position="relative">
            <Avatar.Root size="sm">
              <Avatar.Fallback name={user.firstName} colorPalette="teal" />
            </Avatar.Root>

            {/* TODO status indicator */}
            <Float placement="bottom-end" offsetX="1" offsetY="1" zIndex="1">
              <Circle
                size="3"
                bg="red.500"
                borderWidth="2px"
                borderColor="white"
              />
            </Float>
          </Box>

          <VStack
            align="flex-start"
            gap="0"
            display={{ base: "none", sm: "flex" }}
          >
            <Text
              color="gray.900"
              fontSize="sm"
              fontWeight="medium"
              lineHeight="tight"
            >
              {user.firstName} {user.lastName}
            </Text>
            <Text color="gray.500" fontSize="xs" lineHeight="tight">
              {user.role}
            </Text>
          </VStack>
        </Box>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content minW="180px">
            <Menu.Item value="profile">
              <User size={16} />
              <Box flex="1">Открыть профиль</Box>
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item
              value="logout"
              color="red.600"
              _hover={{ bg: "red.50", color: "red.700" }}
            >
              <LogOut size={16} />
              <Box flex="1">Выйти</Box>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
