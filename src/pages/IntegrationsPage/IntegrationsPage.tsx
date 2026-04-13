import { FC } from "react";
import { Box } from "@chakra-ui/react";
import { IntegrationTabs } from "@features/integrations/ui/IntegrationTabs";

const IntegrationsPage: FC = () => {
  return (
    <Box p={6}>
      <IntegrationTabs />
    </Box>
  );
};

export default IntegrationsPage;
