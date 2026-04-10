import {
  Box,
  Button,
  CloseButton,
  Drawer,
  Flex,
  HStack,
  Link as ChakraLink,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import {
  BarChart3,
  Database,
  LayoutGrid,
  LogIn,
  LucideIcon,
  Menu,
  PlugZap,
  Settings,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";
import { NavbarAccount } from "@/app/entities/account/ui/NavbarAccount";

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/workspace", icon: LayoutGrid, label: "Рабочая область" },
  { href: "/queue", icon: Users, label: "Очередь" },
  { href: "/knowledge-base", icon: Database, label: "База знаний" },
  { href: "/integrations", icon: PlugZap, label: "Интеграции" },
  { href: "/analytics", icon: BarChart3, label: "Аналитика" },
  { href: "/admin-control-panel", icon: Settings, label: "Панель управления" },
];

interface NavbarItemProps extends NavItem {
  onClick?: () => void;
}

const NavbarItem = ({
  href,
  icon: IconComponent,
  label,
  onClick,
}: NavbarItemProps) => (
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
    _hover={{ bg: "teal.50", color: "teal.700", textDecoration: "none" }}
    _currentPage={{ bg: "teal.50", color: "teal.800", borderColor: "teal.200" }}
    onClick={onClick}
  >
    <NavLink to={href}>
      <HStack gap="2">
        <IconComponent size={20} />
        <Text fontSize="sm">{label}</Text>
      </HStack>
    </NavLink>
  </ChakraLink>
);

export const Navbar: FC = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    isAuth,
    isLoading,
  } = useAppSelector((state) => state.account);

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
        {/* Left: logo + desktop nav */}
        <HStack gap="8">
          <Box cursor="pointer" onClick={() => navigate("/")}>
            <Text fontSize="xl" fontWeight="bold" color="teal.500">
              ЛОГО
            </Text>
          </Box>

          <HStack gap="1" display={{ base: "none", lg: "flex" }}>
            {NAV_ITEMS.map((item) => (
              <NavbarItem key={item.href} {...item} />
            ))}
          </HStack>
        </HStack>

        {/* Right: account / login + mobile burger */}
        <HStack gap="2">
          {isAuth ? (
            <NavbarAccount onLogout={handleLogout} />
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

          {/* Mobile burger — visible only below lg */}
          <Box display={{ base: "flex", lg: "none" }}>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Открыть меню"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu size={20} />
            </Button>
          </Box>
        </HStack>
      </Flex>

      {/* Mobile drawer */}
      <Drawer.Root
        open={drawerOpen}
        onOpenChange={(e) => setDrawerOpen(e.open)}
        placement="start"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content maxW="72">
              <Drawer.Header borderBottomWidth="1px">
                <Text fontSize="lg" fontWeight="bold" color="teal.500">
                  ЛОГО
                </Text>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Header>
              <Drawer.Body py="4">
                <VStack align="stretch" gap="1">
                  {NAV_ITEMS.map((item) => (
                    <NavbarItem
                      key={item.href}
                      {...item}
                      onClick={() => setDrawerOpen(false)}
                    />
                  ))}
                </VStack>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
};
