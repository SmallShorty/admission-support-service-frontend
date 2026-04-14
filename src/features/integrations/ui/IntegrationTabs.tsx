import { FC } from "react";
import { Tabs, Box, Link } from "@chakra-ui/react";
import { LuZap, LuScrollText } from "react-icons/lu";
import { IntegrationsManager } from "./IntegrationsManager";
import { IntegrationsLogs } from "./IntegrationsLogs";

export const IntegrationTabs: FC = () => {
  return (
    <Box width="full">
      <Tabs.Root
        lazyMount
        unmountOnExit
        defaultValue="manager"
        variant="line"
      >
        <Tabs.List>
          <Tabs.Trigger value="manager" asChild>
            <Link unstyled href="#manager">
              <LuZap />
              Управление событиями
            </Link>
          </Tabs.Trigger>

          <Tabs.Trigger value="log" asChild>
            <Link unstyled href="#log">
              <LuScrollText />
              Журнал вызовов
            </Link>
          </Tabs.Trigger>
        </Tabs.List>

        <Box mt={6}>
          <Tabs.Content value="manager">
            <IntegrationsManager />
          </Tabs.Content>

          <Tabs.Content value="log">
            <IntegrationsLogs />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
};
