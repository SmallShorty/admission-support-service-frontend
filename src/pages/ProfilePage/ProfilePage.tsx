import { FC, useState } from "react";
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
  Spinner,
  Text,
  Center,
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
import { useAnalytics } from "@/features/analytics/hooks/queries/useAnalytics";
import { AnalyticsPeriod } from "@/features/analytics/model/types";
import { AvgResponseTimeStat } from "@/features/analytics/ui/stats/AvgResponseTimeStat";
import { SlaStatusStat } from "@/features/analytics/ui/stats/SlaStatusStat";
import { TotalRequestsStat } from "@/features/analytics/ui/stats/TotalRequestsStat";
import { CustomerSatisfactionStat } from "@/features/analytics/ui/stats/CustomerSatisfactionStat";
import { HourlyActivityChart } from "@/features/analytics/ui/charts/HourlyActivityChart";
import { TicketVolumeChart } from "@/features/analytics/ui/charts/TicketVolumeChart";

const roleLabels: Record<string, string> = {
  [AccountRole.ADMIN]: "Администратор",
  [AccountRole.OPERATOR]: "Оператор",
  [AccountRole.SUPERVISOR]: "Супервизор",
};

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "day", label: "Сегодня" },
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
];

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
  const [period, setPeriod] = useState<AnalyticsPeriod>("week");

  const { data, isLoading, isError } = useAnalytics(period, account?.id);

  if (!account) return null;

  const roleLabel = roleLabels[account.role] ?? account.role;
  const displayId = account.externalId ?? account.id.slice(0, 8).toUpperCase();
  const isActive = account.status === AccountStatus.ACTIVE;

  return (
    <Box p={6} maxW="1280px">
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

      <Panel borderRadius="2xl" overflow="hidden" borderWidth="1px" borderColor="gray.200" _dark={{ borderColor: "gray.700" }} mb={6}>
        <Box
          h="112px"
          bgGradient="to-r"
          gradientFrom="teal.500"
          gradientTo="teal.700"
        />
        <Box px={6} pb={6}>
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
              <Text fontSize="xl" fontWeight="semibold" color="gray.900" _dark={{ color: "white" }}>
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

          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <InfoCard icon={<Mail size={16} />} label="Email" value={account.email} />
            <InfoCard icon={<Calendar size={16} />} label="Дата начала работы" value={formatDate(account.createdAt)} />
            <InfoCard
              icon={<ShieldCheck size={16} />}
              label="Тип авторизации"
              value={account.authProvider === AuthProvider.INTERNAL ? "Внутренняя" : "Внешняя (SSO)"}
            />
            <InfoCard icon={<Clock size={16} />} label="Последнее обновление" value={formatDateTime(account.updatedAt)} />
          </Grid>
        </Box>
      </Panel>

      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Text fontWeight="semibold" fontSize="md" color="fg.default">Аналитика производительности</Text>
          <Text fontSize="sm" color="fg.muted">Личная статистика за выбранный период</Text>
        </Box>
        <HStack gap={1}>
          {PERIODS.map(({ value, label }) => (
            <Button
              key={value}
              size="sm"
              variant={period === value ? "solid" : "ghost"}
              colorPalette="teal"
              onClick={() => setPeriod(value)}
            >
              {label}
            </Button>
          ))}
        </HStack>
      </Flex>

      {isLoading && (
        <Center minH="300px">
          <Spinner size="lg" color="teal.500" />
        </Center>
      )}

      {isError && (
        <Center minH="300px">
          <Text color="red.500" fontSize="sm">Не удалось загрузить аналитику</Text>
        </Center>
      )}

      {data && (
        <>
          <Flex gap={4} mb={4}>
            <AvgResponseTimeStat
              avgRT={data.performance.avgRT}
              hourlyActivity={data.charts.hourlyActivity}
            />
            <SlaStatusStat
              avgRT={data.performance.avgRT}
              isSlaBreached={data.performance.isSlaBreached}
            />
            <TotalRequestsStat requests={data.requests} />
            <CustomerSatisfactionStat csat={data.performance.csat} />
          </Flex>

          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={4}>
            <HourlyActivityChart data={data.charts.hourlyActivity} />
            <TicketVolumeChart data={data.charts.hourlyTicketVolume} />
          </Grid>
        </>
      )}
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
      <Text fontSize="sm" fontWeight="medium" color="gray.800" _dark={{ color: "gray.100" }}>
        {value}
      </Text>
    </Box>
  </HStack>
);

export default ProfilePage;
