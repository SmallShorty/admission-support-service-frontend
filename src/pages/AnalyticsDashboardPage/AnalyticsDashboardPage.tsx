import { FC } from "react";
import { Box } from "@chakra-ui/react";
import { AnalyticsDashboard } from "@/features/analytics/ui/AnalyticsDashboard";

const AnalyticsDashboardPage: FC = () => {
  return (
    <Box h="full">
      <AnalyticsDashboard />
    </Box>
  );
};

export default AnalyticsDashboardPage;
