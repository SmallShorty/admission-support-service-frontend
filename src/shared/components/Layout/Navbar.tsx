import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { FC } from "react";
import { Home, LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavbarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const NavbarItem = ({ href, icon: IconComponent, label }: NavbarItemProps) => {
  return (
    <Box
      as={NavLink}
      px="4"
      py="2"
      borderRadius="md"
      transition="all 0.2s"
      display="inline-block"
      color="teal.600"
      fontWeight="medium"
      _hover={{
        bg: "teal.50",
        color: "teal.900",
      }}
    >
      <HStack gap="1">
        <IconComponent size={20} />
        <Text fontSize="sm">{label}</Text>
      </HStack>
    </Box>
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
          {/* {onMenuClick && (
            <IconButton
              variant="ghost"
              aria-label="Menu"
              display={{ base: "flex", lg: "none" }}
              onClick={onMenuClick}
            >
              <Menu size={20} />
            </IconButton>
          )} */}

          {/* TODO: Обернуть в <Link> из react-router-dom */}
          <Box cursor="pointer">
            <Text fontSize="xl" fontWeight="bold" color="teal.500">
              ЛОГО
            </Text>
          </Box>

          {/* TODO: Добавить десктопное меню навигации здесь */}
        </HStack>

        <HStack gap="2" display={{ base: "none", md: "flex" }}>
          <NavbarItem href="/" icon={Home} label="Главная" />
        </HStack>
      </Flex>
    </Box>
  );
};
