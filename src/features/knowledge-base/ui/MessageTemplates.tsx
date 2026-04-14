import { FC, useState } from "react";
import { Box, SimpleGrid, Spinner, Center, Text } from "@chakra-ui/react";
import { TemplatesControls } from "@features/templates/ui/TemplatesControls";
import { TemplateInfoModal, TemplateFormData } from "@features/templates/ui/TemplateInfoModal";
import { useTemplates } from "@features/templates/hooks/queries/useTemplates";
import { AdmissionIntentCategory } from "@features/tickets/model/types";
import { Template } from "@features/templates/model/types";
import { TemplateInfoCard } from "./TemplateInfoCard";

export const MessageTemplates: FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string[]>(["all"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const selectedCategory =
    category[0] !== "all" ? (category[0] as AdmissionIntentCategory) : undefined;

  const { data, isLoading, isError } = useTemplates({
    searchTerm: search || undefined,
    category: selectedCategory,
  });

  const handleAddClick = () => {
    setSelectedTemplate(null);
    setModalOpen(true);
  };

  const handleCardClick = (template: Template) => {
    setSelectedTemplate(template);
    setModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
  };

  const handleSave = (data: TemplateFormData) => {
    console.log(data);
    setModalOpen(false);
  };

  return (
    <Box>
      <TemplatesControls
        search={search}
        onSearch={setSearch}
        category={category}
        onCategoryChange={setCategory}
        onAddClick={handleAddClick}
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
        onOpenChange={handleModalClose}
        template={selectedTemplate}
        onSave={handleSave}
      />
    </Box>
  );
};
