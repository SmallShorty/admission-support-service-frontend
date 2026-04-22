import { FC } from "react";
import {
  HStack,
  Input,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
  createListCollection,
  Text,
} from "@chakra-ui/react";
import { IntegrationLogAction, IntegrationLogSeverity } from "../model/types";

const actionOptions = createListCollection({
  items: [
    { label: "Все действия", value: "" },
    { label: "Отправка формы", value: IntegrationLogAction.INTEGRATION_SUBMITTED },
    { label: "Форма не найдена", value: IntegrationLogAction.INTEGRATION_SUBMISSION_NOT_FOUND },
    { label: "Нарушение полей", value: IntegrationLogAction.INTEGRATION_SUBMISSION_READONLY_FIELD_VIOLATION },
    { label: "Создание", value: IntegrationLogAction.INTEGRATION_CREATED },
    { label: "Изменение", value: IntegrationLogAction.INTEGRATION_UPDATED },
    { label: "Активация", value: IntegrationLogAction.INTEGRATION_ACTIVATED },
    { label: "Деактивация", value: IntegrationLogAction.INTEGRATION_DEACTIVATED },
  ],
});

const severityOptions = createListCollection({
  items: [
    { label: "Все", value: "" },
    { label: "INFO", value: IntegrationLogSeverity.INFO },
    { label: "WARN", value: IntegrationLogSeverity.WARN },
    { label: "ERROR", value: IntegrationLogSeverity.ERROR },
  ],
});

interface IntegrationLogsControlsProps {
  action: IntegrationLogAction | undefined;
  onActionChange: (val: IntegrationLogAction | undefined) => void;
  severity: IntegrationLogSeverity | undefined;
  onSeverityChange: (val: IntegrationLogSeverity | undefined) => void;
  dateFrom: string | undefined;
  onDateFromChange: (val: string | undefined) => void;
  dateTo: string | undefined;
  onDateToChange: (val: string | undefined) => void;
}

export const IntegrationLogsControls: FC<IntegrationLogsControlsProps> = ({
  action,
  onActionChange,
  severity,
  onSeverityChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
}) => {
  return (
    <HStack gap="3" wrap="wrap" mb="6">
      <SelectRoot
        collection={actionOptions}
        value={action ? [action] : [""]}
        onValueChange={(e) => {
          const val = e.value[0];
          onActionChange(val ? (val as IntegrationLogAction) : undefined);
        }}
        width="56"
      >
        <SelectTrigger bg="white">
          <SelectValueText placeholder="Все действия" />
        </SelectTrigger>
        <SelectContent>
          {actionOptions.items.map((item) => (
            <SelectItem item={item} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>

      <SelectRoot
        collection={severityOptions}
        value={severity ? [severity] : [""]}
        onValueChange={(e) => {
          const val = e.value[0];
          onSeverityChange(val ? (val as IntegrationLogSeverity) : undefined);
        }}
        width="36"
      >
        <SelectTrigger bg="white">
          <SelectValueText placeholder="Уровень" />
        </SelectTrigger>
        <SelectContent>
          {severityOptions.items.map((item) => (
            <SelectItem item={item} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>

      <HStack gap="2">
        <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">С</Text>
        <Input
          type="date"
          value={dateFrom ?? ""}
          onChange={(e) => onDateFromChange(e.target.value || undefined)}
          size="md"
          width="40"
          bg="white"
        />
      </HStack>

      <HStack gap="2">
        <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">По</Text>
        <Input
          type="date"
          value={dateTo ?? ""}
          onChange={(e) => onDateToChange(e.target.value || undefined)}
          size="md"
          width="40"
          bg="white"
        />
      </HStack>
    </HStack>
  );
};
