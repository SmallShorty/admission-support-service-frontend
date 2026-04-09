import { FC, useState } from "react";
import { Box } from "@chakra-ui/react";
import { TemplatesControls } from "@features/templates/ui/TemplatesControls";
import { TemplateInfoModal, TemplateFormData } from "@features/templates/ui/TemplateInfoModal";

export const MessageTemplates: FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string[]>(["all"]);
  const [modalOpen, setModalOpen] = useState(false);

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
        onAddClick={() => setModalOpen(true)}
      />
      <TemplateInfoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        template={null}
        onSave={handleSave}
      />
    </Box>
  );
};
