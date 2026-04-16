import { FC, useState } from "react";
import { Box, SimpleGrid, Spinner, Center, Text } from "@chakra-ui/react";
import { TemplatesControls } from "@features/templates/ui/TemplatesControls";
import { TemplateInfoModal, TemplateFormData } from "@features/templates/ui/TemplateInfoModal";
import { useTemplates } from "@features/templates/hooks/queries/useTemplates";
import { useCreateTemplate } from "@features/templates/hooks/mutations/useCreateTemplate";
import { useUpdateTemplate } from "@features/templates/hooks/mutations/useUpdateTemplate";
import { useDeactivateTemplate } from "@features/templates/hooks/mutations/useDeactivateTemplate";
import { useActivateTemplate } from "@features/templates/hooks/mutations/useActivateTemplate";
import { AdmissionIntentCategory } from "@features/tickets/model/types";
import { Template } from "@features/templates/model/types";
import { TemplateInfoCard } from "./TemplateInfoCard";

export const MessageTemplates: FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string[]>(["all"]);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const selectedCategory =
    category[0] !== "all" ? (category[0] as AdmissionIntentCategory) : undefined;

  const { data, isLoading, isError } = useTemplates({
    searchTerm: search || undefined,
    category: selectedCategory,
    includeInactive: includeInactive || undefined,
  });

  const { mutate: createTemplate, isPending: isCreating } = useCreateTemplate();
  const { mutate: updateTemplate, isPending: isUpdating } = useUpdateTemplate();
  const { mutate: deactivateTemplate, isPending: isDeactivating } = useDeactivateTemplate();
  const { mutate: activateTemplate, isPending: isActivating } = useActivateTemplate();

  const handleAddClick = () => {
    setSelectedTemplate(null);
    setModalOpen(true);
  };

  const handleCardClick = (template: Template) => {
    setSelectedTemplate(template);
    setModalOpen(true);
  };

  const handleSave = (formData: TemplateFormData) => {
    if (selectedTemplate) {
      updateTemplate(
        { id: selectedTemplate.id, ...formData, category: formData.category as AdmissionIntentCategory },
        { onSuccess: () => setModalOpen(false) },
      );
    } else {
      createTemplate(
        { ...formData, category: formData.category as AdmissionIntentCategory },
        { onSuccess: () => setModalOpen(false) },
      );
    }
  };

  const handleDeactivate = () => {
    if (!selectedTemplate) return;
    deactivateTemplate(selectedTemplate.id, { onSuccess: () => setModalOpen(false) });
  };

  const handleActivate = () => {
    if (!selectedTemplate) return;
    activateTemplate(selectedTemplate.id, { onSuccess: () => setModalOpen(false) });
  };

  return (
    <Box>
      <TemplatesControls
        search={search}
        onSearch={setSearch}
        category={category}
        onCategoryChange={setCategory}
        onAddClick={handleAddClick}
        includeInactive={includeInactive}
        onIncludeInactiveChange={setIncludeInactive}
      />

      {isLoading && (
        <Center py="16">
          <Spinner size="lg" />
        </Center>
      )}

      {isError && (
        <Center py="16">
          <Text color="fg.muted">Не удалось загрузить шаблоны</Text>
        </Center>
      )}

      {data && (
        <SimpleGrid columns={4} gap="4">
          {data.items.map((template) => (
            <TemplateInfoCard
              key={template.id}
              template={template}
              onClick={() => handleCardClick(template)}
            />
          ))}
        </SimpleGrid>
      )}

      <TemplateInfoModal
        key={selectedTemplate?.id ?? "new"}
        open={modalOpen}
        onOpenChange={(open) => setModalOpen(open)}
        template={selectedTemplate}
        onSave={handleSave}
        isLoading={isCreating || isUpdating}
        onDeactivate={handleDeactivate}
        onActivate={handleActivate}
        isDeactivating={isDeactivating}
        isActivating={isActivating}
      />
    </Box>
  );
};
