import { selectAccount } from "@/app/entities/account/model/selectors";
import { useAppSelector } from "@/app/hooks";
import { AccountRole } from "@/app/entities/account/model/types";
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/shared/animations";
import {
  LayoutGrid,
  Users,
  Database,
  PlugZap,
  BarChart3,
  Settings,
  MessageSquare,
  Zap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLogo } from "@/shared/components/ui/AppLogo";

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);

interface NavCard {
  href: string;
  icon: typeof LayoutGrid;
  label: string;
  description: string;
  color: string;
  badge?: string;
  adminOnly?: boolean;
}

const NAV_CARDS: NavCard[] = [
  {
    href: "/workspace",
    icon: LayoutGrid,
    label: "Рабочая область",
    description:
      "Ведите активные тикеты, переписывайтесь с абитуриентами в реальном времени и фиксируйте решения.",
    color: "teal",
  },
  {
    href: "/queue",
    icon: Users,
    label: "Очередь обращений",
    description:
      "Смотрите все входящие обращения, распределяйте нагрузку и контролируйте статус тикетов.",
    color: "blue",
    adminOnly: true,
  },
  {
    href: "/knowledge-base",
    icon: Database,
    label: "База знаний",
    description:
      "Шаблоны ответов и типовые сценарии — быстро находите нужное и вставляйте в чат одним кликом.",
    color: "purple",
  },
  {
    href: "/integrations",
    icon: PlugZap,
    label: "Интеграции",
    description:
      "Подключайте внешние каналы: сайт, мессенджеры, почту. Управляйте виджетами и публичными API.",
    color: "orange",
    badge: "Новое",
    adminOnly: true,
  },
  {
    href: "/analytics",
    icon: BarChart3,
    label: "Аналитика",
    description:
      "Дашборды по нагрузке, времени ответа и тематике обращений — принимайте решения на основе данных.",
    color: "green",
    adminOnly: true,
  },
  {
    href: "/admin-control-panel",
    icon: Settings,
    label: "Панель управления",
    description:
      "Управление аккаунтами сотрудников, ролями и настройками системы.",
    color: "gray",
    adminOnly: true,
  },
];

const FEATURE_HIGHLIGHTS = [
  {
    icon: MessageSquare,
    title: "Чат в реальном времени",
    text: "WebSocket-соединение обеспечивает мгновенную доставку сообщений без перезагрузки страницы.",
  },
  {
    icon: Zap,
    title: "Быстрые шаблоны",
    text: "Вставляйте готовые ответы прямо из базы знаний — экономьте время на типовых вопросах.",
  },
  {
    icon: ShieldCheck,
    title: "Ролевой доступ",
    text: "Оператор, супервайзер, администратор — каждый видит только то, что нужно для работы.",
  },
];

const HomePage = () => {
  const account = useAppSelector(selectAccount);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  if (!account) return null;

  const isAdmin = account.role === AccountRole.ADMIN;
  const visibleCards = NAV_CARDS.filter((c) => !c.adminOnly || isAdmin);

  const animProps = reduceMotion
    ? {}
    : { initial: "hidden", animate: "visible", variants: staggerContainer };

  return (
    <Box maxW="1200px" mx="auto" py={{ base: 6, md: 10 }}>
      <MotionBox {...animProps}>
        {/* Hero */}
        <MotionBox variants={fadeUp} mb={10}>
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "flex-start", md: "center" }}
            justify="space-between"
            gap={6}
            bg="white"
            borderRadius="2xl"
            px={{ base: 6, md: 10 }}
            py={{ base: 8, md: 10 }}
            boxShadow="0 2px 12px rgba(0,0,0,0.06)"
            borderWidth="1px"
            borderColor="gray.100"
            overflow="hidden"
            position="relative"
          >
            <Box
              position="absolute"
              right="-60px"
              top="-60px"
              w="300px"
              h="300px"
              borderRadius="full"
              bg="teal.50"
              opacity={0.6}
              pointerEvents="none"
            />

            <VStack align="flex-start" gap={3} position="relative">
              <Heading
                size={{ base: "2xl", md: "3xl" }}
                color="gray.800"
                lineHeight="1.2"
              >
                Добро пожаловать
              </Heading>

              <Text color="gray.500" fontSize="lg" maxW="520px">
                Система поддержки абитуриентов — единое рабочее пространство для
                обработки обращений, управления шаблонами и аналитики.
              </Text>
            </VStack>

            <AppLogo variant="icon-only" />
          </Flex>
        </MotionBox>

        {/* Nav cards */}
        <MotionBox variants={fadeUp} mb={4}>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color="gray.400"
            letterSpacing="widest"
            textTransform="uppercase"
          >
            Разделы системы
          </Text>
        </MotionBox>

        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={4}
          mb={10}
        >
          {visibleCards.map((card) => (
            <MotionBox key={card.href} variants={fadeUp}>
              <Flex
                direction="column"
                gap={4}
                bg="white"
                borderRadius="xl"
                px={6}
                py={5}
                borderWidth="1px"
                borderColor="gray.100"
                boxShadow="0 1px 4px rgba(0,0,0,0.06)"
                cursor="pointer"
                role="group"
                transition="all 0.2s ease"
                height="100%"
                _hover={{
                  boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
                  borderColor: `${card.color}.200`,
                  transform: "translateY(-2px)",
                }}
                onClick={() => navigate(card.href)}
              >
                <Flex justify="space-between" align="flex-start">
                  <Flex
                    align="center"
                    justify="center"
                    w="42px"
                    h="42px"
                    borderRadius="lg"
                    bg={`${card.color}.50`}
                    flexShrink={0}
                  >
                    <Icon
                      as={card.icon}
                      boxSize={5}
                      color={`${card.color}.500`}
                    />
                  </Flex>
                  {card.badge && (
                    <Badge
                      colorPalette={card.color}
                      size="sm"
                      borderRadius="full"
                      px={2}
                    >
                      {card.badge}
                    </Badge>
                  )}
                </Flex>

                <VStack align="flex-start" gap={1} flex={1}>
                  <Text fontWeight="semibold" color="gray.800" fontSize="md">
                    {card.label}
                  </Text>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.6">
                    {card.description}
                  </Text>
                </VStack>

                <HStack
                  gap={1}
                  color={`${card.color}.500`}
                  fontSize="sm"
                  fontWeight="medium"
                  opacity={0}
                  _groupHover={{ opacity: 1 }}
                  transition="opacity 0.2s"
                >
                  <Text>Перейти</Text>
                  <Icon as={ArrowRight} boxSize={4} />
                </HStack>
              </Flex>
            </MotionBox>
          ))}
        </Grid>

        {/* Feature highlights */}
        <MotionBox variants={fadeUp} mb={4}>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color="gray.400"
            letterSpacing="widest"
            textTransform="uppercase"
          >
            Возможности платформы
          </Text>
        </MotionBox>

        <MotionFlex
          variants={fadeUp}
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          {FEATURE_HIGHLIGHTS.map((f) => (
            <Flex
              key={f.title}
              flex={1}
              gap={4}
              align="flex-start"
              bg="white"
              borderRadius="xl"
              px={5}
              py={5}
              borderWidth="1px"
              borderColor="gray.100"
              boxShadow="0 1px 4px rgba(0,0,0,0.06)"
            >
              <Flex
                align="center"
                justify="center"
                w="38px"
                h="38px"
                borderRadius="lg"
                bg="teal.50"
                flexShrink={0}
              >
                <Icon as={f.icon} boxSize={4} color="teal.500" />
              </Flex>
              <VStack align="flex-start" gap={1}>
                <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                  {f.title}
                </Text>
                <Text color="gray.500" fontSize="sm" lineHeight="1.6">
                  {f.text}
                </Text>
              </VStack>
            </Flex>
          ))}
        </MotionFlex>
      </MotionBox>
    </Box>
  );
};

export default HomePage;
