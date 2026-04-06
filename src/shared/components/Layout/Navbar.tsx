import { Box, Flex, HStack, Link as ChakraLink, Text } from "@chakra-ui/react";
import { FC } from "react";
import {
  BarChart3,
  Database,
  Home,
  LayoutGrid,
  LucideIcon,
  PlugZap,
  Settings,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
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
        <HStack gap="4">
          {}

          {}
          <Box cursor="pointer">
            <Text fontSize="xl" fontWeight="bold" color="teal.500">
              ЛОГО
            </Text>
          </Box>

          {}
        </HStack>

        <HStack
          gap="3"
          display={{
            base: "none",
            md: "flex",
          }}
        >
          <NavbarItem
            href="/workspace"
            icon={LayoutGrid}
            label="Рабочая область"
          />
          <NavbarItem href="/queue" icon={Users} label="Очередь" />
          <NavbarItem href="/resources" icon={Database} label="База ресурсов" />
          <NavbarItem href="/integrations" icon={PlugZap} label="Интеграции" />
          <NavbarItem href="/analytics" icon={BarChart3} label="Аналитика" />
          <NavbarItem href="/admin" icon={Settings} label="Панель управления" />
        </HStack>
      </Flex>
    </Box>
  );
};
