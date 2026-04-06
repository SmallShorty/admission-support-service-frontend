import { Badge, BadgeProps, HStack, Icon, Text } from "@chakra-ui/react";
import { Tag } from "lucide-react";
import { AdmissionIntentCategory } from "../model/types";

const INTENT_METADATA: Record<
  AdmissionIntentCategory,
  {
    label: string;
    color: string;
  }
> = {
  [AdmissionIntentCategory.TECHNICAL_ISSUES]: {
    label: "Технические проблемы",
    color: "#3b82f6",
  },
  [AdmissionIntentCategory.DEADLINES_TIMELINES]: {
    label: "Сроки и дедлайны",
    color: "#8b5cf6",
  },
  [AdmissionIntentCategory.DOCUMENT_SUBMISSION]: {
    label: "Подача документов",
    color: "#ec4899",
  },
  [AdmissionIntentCategory.STATUS_VERIFICATION]: {
    label: "Проверка статуса",
    color: "#10b981",
  },
  [AdmissionIntentCategory.SCORES_COMPETITION]: {
    label: "Баллы и конкурс",
    color: "#f59e0b",
  },
  [AdmissionIntentCategory.PAYMENTS_CONTRACTS]: {
    label: "Оплата и договоры",
    color: "#ef4444",
  },
  [AdmissionIntentCategory.ENROLLMENT]: {
    label: "Зачисление",
    color: "#06b6d4",
  },
  [AdmissionIntentCategory.DORMITORY_HOUSING]: {
    label: "Общежитие",
    color: "#84cc16",
  },
  [AdmissionIntentCategory.STUDIES_SCHEDULE]: {
    label: "Учеба и расписание",
    color: "#a855f7",
  },
  [AdmissionIntentCategory.EVENTS]: {
    label: "Мероприятия",
    color: "#f97316",
  },
  [AdmissionIntentCategory.GENERAL_INFO]: {
    label: "Общая информация",
    color: "#14b8a6",
  },
  [AdmissionIntentCategory.PROGRAM_CONSULTATION]: {
    label: "Консультация по программам",
    color: "#6366f1",
  },
};

interface IntentCategoryBadgeProps extends BadgeProps {
  category: AdmissionIntentCategory;
  showIcon?: boolean;
}

export const IntentCategoryBadge = ({
  category,
  showIcon = false,
  ...props
}: IntentCategoryBadgeProps) => {
  const metadata = INTENT_METADATA[category];
  if (!metadata) return null;
  return (
    <Badge
      variant="subtle"
      size="sm"
      px="2"
      py="0.5"
      borderRadius="md"
      textTransform="none"
      fontWeight="medium"
      css={{
        bg: `${metadata.color}15`,
        color: metadata.color,
        borderColor: `${metadata.color}30`,
        borderWidth: "1px",
      }}
      {...props}
    >
      <HStack gap="1">
        {showIcon && (
          <Icon asChild>
            <Tag size="10px" />
          </Icon>
        )}
        <Text as="span" fontSize="11px">
          {metadata.label}
        </Text>
      </HStack>
    </Badge>
  );
};
