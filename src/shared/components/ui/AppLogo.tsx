import { Flex, Text, Icon } from "@chakra-ui/react";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppLogoProps {
  variant?: "navbar" | "hero" | "icon-only";
  onClick?: () => void;
}

export const AppLogo = ({ variant = "navbar", onClick }: AppLogoProps) => {
  const navigate = useNavigate();
  const handleClick = onClick ?? (() => navigate("/"));

  if (variant === "icon-only") {
    return (
      <Flex
        align="center"
        justify="center"
        w={{ base: "64px", md: "96px" }}
        h={{ base: "64px", md: "96px" }}
        borderRadius="2xl"
        bg="teal.500"
        flexShrink={0}
        cursor="pointer"
        onClick={handleClick}
      >
        <Icon as={GraduationCap} color="white" boxSize={{ base: 8, md: 12 }} />
      </Flex>
    );
  }

  if (variant === "hero") {
    return (
      <Flex align="center" gap={3} cursor="pointer" onClick={handleClick}>
        <Flex
          align="center"
          justify="center"
          w="48px"
          h="48px"
          borderRadius="xl"
          bg="teal.500"
          flexShrink={0}
        >
          <Icon as={GraduationCap} color="white" boxSize={6} />
        </Flex>
        <Flex direction="column" gap={0}>
          <Text fontSize="lg" fontWeight="bold" color="teal.600" lineHeight="1.1">
            AdmissionSupport
          </Text>
          <Text fontSize="xs" color="gray.400" lineHeight="1.2">
            Система поддержки абитуриентов
          </Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex align="center" gap={2} cursor="pointer" onClick={handleClick}>
      <Flex
        align="center"
        justify="center"
        w="32px"
        h="32px"
        borderRadius="lg"
        bg="teal.500"
        flexShrink={0}
      >
        <Icon as={GraduationCap} color="white" boxSize={4} />
      </Flex>
      <Text fontSize="lg" fontWeight="bold" color="teal.500">
        AdmissionSupport
      </Text>
    </Flex>
  );
};
