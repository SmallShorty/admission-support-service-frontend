import { FC } from "react";
import {
  Avatar,
  Box,
  Button,
  Circle,
  Flex,
  Float,
  Grid,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/react";
import { Panel } from "@shared/components/ui/panel";
import {
  Briefcase,
  Calendar,
  Clock,
  Edit2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import {
  selectAccount,
  selectFullName,
} from "@/app/entities/account/model/selectors";
import {
  AccountRole,
  AccountStatus,
  AuthProvider,
} from "@/app/entities/account/model/types";

const roleLabels: Record<string, string> = {
  [AccountRole.ADMIN]: "Администратор",
  [AccountRole.OPERATOR]: "Оператор",
  [AccountRole.SUPERVISOR]: "Супервизор",
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const ProfilePage: FC = () => {
  const account = useAppSelector(selectAccount);
  const fullName = useAppSelector(selectFullName);

  if (!account) return null;

  const roleLabel = roleLabels[account.role] ?? account.role;
  const displayId = account.externalId ?? account.id.slice(0, 8).toUpperCase();
  const isActive = account.status === AccountStatus.ACTIVE;

  return (
    <Box p={6} maxW="960px">
      {/* Заголовок страницы */}
      <Flex justify="space-between" align="flex-start" mb={6}>
        <Box>
          <Heading size="lg" fontWeight="semibold" color="gray.900" _dark={{ color: "white" }}>
            Настройки профиля
          </Heading>
          <Text color="gray.500" fontSize="sm" mt={1}>
            Личная информация и аналитика производительности
          </Text>
        </Box>
        <Button variant="outline" colorPalette="teal" size="sm">
          <Edit2 size={14} />
          Редактировать профиль
        </Button>
      </Flex>

      {/* Карточка профиля */}
      <Panel borderRadius="2xl" overflow="hidden" borderWidth="1px" borderColor="gray.200" _dark={{ borderColor: "gray.700" }}>
        {/* Баннер */}
        <Box
          h="112px"
          bgGradient="to-r"
          gradientFrom="teal.500"
          gradientTo="teal.700"
        />

        {/* Контент */}
        <Box px={6} pb={6}>
          {/* Аватар + имя */}
          <Flex gap={5} align="flex-end" mt="-44px" mb={6}>
            <Box position="relative" flexShrink={0}>
              <Box
                borderWidth="4px"
                borderColor="white"
                borderRadius="full"
                _dark={{ borderColor: "gray.800" }}
                display="inline-flex"
              >
                <Avatar.Root size="2xl">
                  <Avatar.Fallback colorPalette="teal" name={fullName} />
                </Avatar.Root>
              </Box>
              <Float placement="bottom-end" offsetX="6" offsetY="6">
                <Circle
                  size="4"
                  bg={isActive ? "green.500" : "gray.400"}
                  borderWidth="2px"
                  borderColor="white"
                  _dark={{ borderColor: "gray.800" }}
                />
              </Float>
            </Box>

            <Box pb={1}>
              <Text
                fontSize="xl"
                fontWeight="semibold"
                color="gray.900"
                _dark={{ color: "white" }}
              >
                {fullName}
              </Text>
              <HStack gap={4} mt={1} color="gray.500" fontSize="sm">
                <HStack gap={1}>
                  <Briefcase size={13} />
                  <Text>{roleLabel}</Text>
                </HStack>
                <HStack gap={1}>
                  <ShieldCheck size={13} />
                  <Text>ID: {displayId}</Text>
                </HStack>
              </HStack>
            </Box>
          </Flex>

          {/* Информационная сетка */}
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <InfoCard
              icon={<Mail size={16} />}
              label="Email"
              value={account.email}
            />
            <InfoCard
              icon={<Calendar size={16} />}
              label="Дата начала работы"
              value={formatDate(account.createdAt)}
            />
            <InfoCard
              icon={<ShieldCheck size={16} />}
              label="Тип авторизации"
              value={
                account.authProvider === AuthProvider.INTERNAL
                  ? "Внутренняя"
                  : "Внешняя (SSO)"
              }
            />
            <InfoCard
              icon={<Clock size={16} />}
              label="Последнее обновление"
              value={formatDateTime(account.updatedAt)}
            />
          </Grid>
        </Box>
      </Panel>
    </Box>
  );
};

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoCard: FC<InfoCardProps> = ({ icon, label, value }) => (
  <HStack
    gap={3}
    p={4}
    borderWidth="1px"
    borderColor="gray.100"
    borderRadius="xl"
    bg="gray.50"
    _dark={{ bg: "gray.700", borderColor: "gray.600" }}
  >
    <Flex
      align="center"
      justify="center"
      w="9"
      h="9"
      borderRadius="lg"
      bg="teal.50"
      color="teal.600"
      flexShrink={0}
      _dark={{ bg: "teal.900", color: "teal.300" }}
    >
      {icon}
    </Flex>
    <Box>
      <Text fontSize="xs" color="gray.500" mb={0.5}>
        {label}
      </Text>
      <Text
        fontSize="sm"
        fontWeight="medium"
        color="gray.800"
        _dark={{ color: "gray.100" }}
      >
        {value}
      </Text>
    </Box>
  </HStack>
);

export default ProfilePage;
