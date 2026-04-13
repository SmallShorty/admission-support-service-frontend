import { FC, useState } from "react";
import { Stack } from "@chakra-ui/react";
import { useIntegrations } from "../hooks/queries/useIntegrations";
import { useIntegrationsFilters } from "../hooks/useIntegrationsFilters";
import { useCreateIntegration } from "../hooks/mutations/useCreateIntegration";
import { useUpdateIntegration } from "../hooks/mutations/useUpdateIntegration";
import { useActivateIntegration } from "../hooks/mutations/useActivateIntegration";
import { useDeactivateIntegration } from "../hooks/mutations/useDeactivateIntegration";
import { IntegrationsControls } from "./IntegrationsControls";
import { IntegrationsListTable } from "./IntegrationsListTable";
import { IntegrationInfoModal, IntegrationFormData } from "./IntegrationInfoModal";
import { IntegrationDto, UpdateIntegrationPayload } from "../model/types";

export const IntegrationsManager: FC = () => {
  const { filters, ui } = useIntegrationsFilters(20);
  const { data, isFetching } = useIntegrations(filters);

  const createMutation = useCreateIntegration();
  const updateMutation = useUpdateIntegration();
  const activateMutation = useActivateIntegration();
  const deactivateMutation = useDeactivateIntegration();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationDto | null>(null);

  const handleOpenCreate = () => {
    setSelectedIntegration(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (integration: IntegrationDto) => {
    setSelectedIntegration(integration);
    setIsModalOpen(true);
  };

  const handleSave = (formData: IntegrationFormData | UpdateIntegrationPayload) => {
    if (selectedIntegration) {
      updateMutation.mutate(
        { id: selectedIntegration.id, payload: formData as UpdateIntegrationPayload },
        { onSuccess: () => setIsModalOpen(false) },
      );
    } else {
      createMutation.mutate(formData as IntegrationFormData, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleTestCall = (integration: IntegrationDto) => {
    console.log("[Integrations] Test call:", integration.slug);
  };

  return (
    <Stack gap="4">
      <IntegrationsControls
        search={ui.searchTerm}
        onSearch={ui.setSearchTerm}
        eventType={ui.eventType}
        onEventTypeChange={ui.setEventType}
        onAddClick={handleOpenCreate}
      />

      <IntegrationsListTable
        integrations={data?.items ?? []}
        isLoading={isFetching}
        page={ui.page}
        limit={20}
        totalCount={data?.total ?? 0}
        onPageChange={ui.handlePageChange}
        onEdit={handleOpenEdit}
        onTestCall={handleTestCall}
        onActivate={(item) => activateMutation.mutate(item.id)}
        onDeactivate={(item) => deactivateMutation.mutate(item.id)}
      />

      <IntegrationInfoModal
        key={selectedIntegration?.id ?? "create"}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        integration={selectedIntegration}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </Stack>
  );
};
