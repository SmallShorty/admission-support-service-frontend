import { FC, useState, useMemo } from "react";
import { Flex, HStack, Text, Button } from "@chakra-ui/react";
import {
  Combobox,
  Portal,
  useListCollection,
  type CollectionItem,
} from "@chakra-ui/react";
import { Account } from "@/app/entities/account/model/types";
import { AnalyticsPeriod } from "../model/types";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchAccounts } from "../hooks/queries/useSearchAccounts";
import { getAccountFullName } from "../utils/formatAccountFullName";

interface DashboardFilterBarProps {
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  agentId: string;
  onAgentIdChange: (agentId: string) => void;
  lastUpdated: string;
}

// FIXME: still show NO RESULTS even with results
// FIXME: on viewing statics on operator it deletes selected operator

const PERIODS: AnalyticsPeriod[] = ["day", "week", "month"];

const periodLabels: Record<AnalyticsPeriod, string> = {
  day: "Сегодня",
  week: "За неделю",
  month: "За месяц",
};

export const DashboardFilterBar: FC<DashboardFilterBarProps> = ({
  period,
  onPeriodChange,
  onAgentIdChange,
  lastUpdated,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 300);
  const { data: searchResults, isLoading } =
    useSearchAccounts(debouncedSearchTerm);

  const items = useMemo<CollectionItem[]>(
    () =>
      (Array.isArray(searchResults) ? searchResults : [])?.map(
        (account: Account) => ({
          label: getAccountFullName(account),
          value: account.id,
        }),
      ) ?? [],
    [searchResults],
  );

  const { collection } = useListCollection({ initialItems: items });

  const formattedLastUpdated = new Date(lastUpdated).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Flex gap="4" align="center" justify="space-between" mb="6" flexWrap="wrap">
      {/* Operator search with Combobox */}
      <Combobox.Root
        collection={collection}
        onValueChange={(details) => {
          if (details.value.length > 0) {
            onAgentIdChange(details.value[0]);
          }
        }}
        width={{ base: "full", md: "200px" }}
      >
        <Combobox.Control>
          <Combobox.Input
            placeholder="Поиск оператора..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Combobox.IndicatorGroup>
            <Combobox.ClearTrigger />
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner>
            <Combobox.Content maxW="200px">
              <Combobox.Empty>
                {isLoading ? "Загрузка..." : "Нет результатов"}
              </Combobox.Empty>
              {items.map((item) => (
                <Combobox.Item item={item} key={item.value}>
                  {item.label}
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              ))}
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>

      <HStack gap="2">
        {/* Period selector */}
        <HStack gap="2">
          {PERIODS.map((p) => (
            <Button
              key={p}
              onClick={() => onPeriodChange(p)}
              colorPalette={period === p ? "teal" : "gray"}
              variant={period === p ? "solid" : "outline"}
              size="sm"
            >
              {periodLabels[p]}
            </Button>
          ))}
        </HStack>
        {/* Last updated */}
        <Text fontSize="xs" color="fg.muted" whiteSpace="nowrap">
          Обновлено: {formattedLastUpdated}
        </Text>
      </HStack>
    </Flex>
  );
};
