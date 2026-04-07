import {
  Box,
  Flex,
  HStack,
  Link as ChakraLink,
  Text,
  VStack,
  Float,
  Circle,
  Menu,
  Portal,
  Avatar,
  Button,
} from "@chakra-ui/react";
import { FC } from "react";
import {
  BarChart3,
  Database,
  LayoutGrid,
  LucideIcon,
  PlugZap,
  Settings,
  Users,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";

interface NavbarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const NavbarItem = ({ href, icon: IconComponent, label }: NavbarItemProps) => {
  return (
    <ChakraLink
      asChild
      px="4"
      py="2"
      borderRadius="md"
      transition="all 0.2s"
      textDecoration="none"
      color="teal.600"
      fontWeight="medium"
      borderWidth="2px"
      borderColor="transparent"
      _hover={{
        bg: "teal.50",
        color: "teal.700",
        textDecoration: "none",
      }}
      _currentPage={{
        bg: "teal.50",
        color: "teal.800",
        borderColor: "teal.200",
      }}
    >
      <NavLink to={href}>
        <HStack gap="2">
          <IconComponent size={20} />
          <Text fontSize="sm">{label}</Text>
        </HStack>
      </NavLink>
    </ChakraLink>
  );
};

export const Navbar: FC = () => {
  const navigate = useNavigate();

  const {
    data: user,
    isAuth,
    isLoading,
  } = useSelector((state: RootState) => state.account);

  function handleLogout() {
    throw new Error("Function not implemented.");
    // TODO logout function
    navigate("/login");
  }

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="sticky"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
    >
      <Flex h="16" px="6" align="center" justify="space-between" gap="4">
        {/* Левая часть */}
        <HStack gap="8">
          <Box cursor="pointer">
            <Text fontSize="xl" fontWeight="bold" color="teal.500">
              ЛОГО
            </Text>
          </Box>

          <HStack gap="1" display={{ base: "none", lg: "flex" }}>
            <NavbarItem
              href="/workspace"
              icon={LayoutGrid}
              label="Рабочая область"
            />
            <NavbarItem href="/queue" icon={Users} label="Очередь" />
            <NavbarItem
              href="/resources"
              icon={Database}
              label="База ресурсов"
            />
            <NavbarItem
              href="/integrations"
              icon={PlugZap}
              label="Интеграции"
            />
            <NavbarItem href="/analytics" icon={BarChart3} label="Аналитика" />
            <NavbarItem
              href="/admin"
              icon={Settings}
              label="Панель управления"
            />
          </HStack>
        </HStack>

        {/* Правая часть: Меню пользователя */}
        {isAuth && user ? (
          <Menu.Root
            positioning={{ placement: "bottom-end" }}
            onSelect={(details) => {
              if (details.value === "profile") navigate("/profile");
              if (details.value === "logout") handleLogout();
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
                    <Avatar.Fallback
                      name={user.firstName}
                      colorPalette="teal"
                    />
                  </Avatar.Root>

                  {/* TODO status indicator */}
                  <Float
                    placement="bottom-end"
                    offsetX="1"
                    offsetY="1"
                    zIndex="1"
                  >
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
                    onClick={() => confirm("Вы уверены?")}
                  >
                    <LogOut size={16} />
                    <Box flex="1">Выйти</Box>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        ) : (
          <Button
            variant="ghost"
            colorPalette="teal"
            size="sm"
            onClick={() => navigate("/login")}
            loading={isLoading}
          >
            <LogIn size={18} />
            Войти
          </Button>
        )}
      </Flex>
    </Box>
  );
};
