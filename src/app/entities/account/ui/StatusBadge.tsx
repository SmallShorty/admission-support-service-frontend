import { Badge, Flex } from "@chakra-ui/react";
import { Lock, HelpCircle } from "lucide-react";

// Типизируем пропсы, чтобы TS подсказывал ошибки еще до компиляции
interface StatusBadgeProps {
  status?: "Active" | "Inactive" | "Locked" | string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const configs: Record<
    string,
    { color: string; label: string; icon: React.ReactNode }
  > = {
    Active: { color: "emerald", label: "Активен", icon: null },
    Inactive: { color: "gray", label: "Деактивирован", icon: null },
    Locked: { color: "red", label: "Заблокирован", icon: <Lock size={12} /> },
  };

  // 1. Проверяем, существует ли статус, иначе берем фолбек (например, Inactive)
  // 2. Если пришло что-то совсем странное, возвращаем нейтральный конфиг
  const currentConfig =
    status && configs[status]
      ? configs[status]
      : {
          color: "gray",
          label: status || "Неизвестно",
          icon: <HelpCircle size={12} />,
        };

  const { color, label, icon } = currentConfig;

  return (
    <Badge
      colorPalette={color}
      variant="surface"
      size="md"
      borderRadius="md"
      px="2"
    >
      <Flex align="center" gap="1.5">
        {icon}
        {label}
      </Flex>
    </Badge>
  );
};
