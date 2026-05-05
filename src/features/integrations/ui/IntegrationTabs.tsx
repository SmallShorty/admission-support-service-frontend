import { FC } from "react";
import { Tabs, Box, Link } from "@chakra-ui/react";
import { LuZap, LuScrollText, LuBell } from "react-icons/lu";
import { IntegrationsManager } from "./IntegrationsManager";
import { IntegrationsLogs } from "./IntegrationsLogs";
import { NotificationsManager } from "./NotificationsManager";

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

          <Tabs.Trigger value="notifications" asChild>
            <Link unstyled href="#notifications">
              <LuBell />
              Уведомления
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

          <Tabs.Content value="notifications">
            <NotificationsManager />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
};
