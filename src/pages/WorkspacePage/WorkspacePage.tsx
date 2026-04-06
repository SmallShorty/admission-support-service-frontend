import { SidebarTicketQueue } from "@/features/tickets/components/SidebarTicketQueue";
import { Grid } from "@chakra-ui/react";

const WorkspacePage = () => {
  return (
    <Grid templateColumns="300px 1fr 350px">
      <SidebarTicketQueue />
    </Grid>
  );
};

export default WorkspacePage;
