import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Select,
  Stack,
  createListCollection,
} from "@chakra-ui/react";
import Placeholder from "@tiptap/extension-placeholder";
import { JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { INTENT_METADATA } from "@features/tickets/model/intentMetadata";
import { AdmissionIntentCategory } from "@features/tickets/model/types";
import {
  Control,
  RichTextEditor,
} from "@shared/components/ui/rich-text-editor";
import { Template } from "../model/types";

export interface TemplateFormData {
  title: string;
  alias: string;
  content: JSONContent;
  category: string;
}

interface TemplateInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
  onSave: (data: TemplateFormData) => void;
  isLoading?: boolean;
}

const NODE_TYPE_MAP: Record<string, string> = {
  bullet_list: "bulletList",
  ordered_list: "orderedList",
  list_item: "listItem",
  hard_break: "hardBreak",
  horizontal_rule: "horizontalRule",
  code_block: "codeBlock",
};

function normalizeContent(node: JSONContent): JSONContent {
  const type = node.type ? (NODE_TYPE_MAP[node.type] ?? node.type) : node.type;
  return {
    ...node,
    type,
    content: node.content?.map(normalizeContent),
  };
}

const CATEGORIES = createListCollection({
  items: (
    Object.entries(INTENT_METADATA) as [
      AdmissionIntentCategory,
      { label: string; color: string },
    ][]
  ).map(([value, { label }]) => ({ value, label })),
});

export const TemplateInfoModal = ({
  open,
  onOpenChange,
  template,
  onSave,
  isLoading = false,
}: TemplateInfoModalProps) => {
  const isEdit = !!template;

  const [form, setForm] = useState({
    title: template?.title ?? "",
    alias: template?.alias ?? "",
    category:
      (template as any)?.category ?? AdmissionIntentCategory.GENERAL_INFO,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Введите текст шаблона..." }),
    ],
    content: template?.content ? normalizeContent(template.content) : "",
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      title: template?.title ?? "",
      alias: template?.alias ?? "",
      category:
        (template as any)?.category ?? AdmissionIntentCategory.GENERAL_INFO,
    });
    if (editor) {
      editor.commands.setContent(
        template?.content ? normalizeContent(template.content) : "",
      );
    }
  }, [open, template, editor]);

  const setField = (field: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.title || !form.alias || !editor || editor.isEmpty) return;
    const data = { ...form, content: editor.getJSON() };
    console.log("TemplateInfoModal submit:", data);
    onSave(data);
  };

  const isSubmitDisabled =
    isLoading || !form.title || !form.alias || !editor || editor.isEmpty;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      placement="center"
      lazyMount
      motionPreset="slide-in-bottom"
      size="lg"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="2xl" boxShadow="2xl">
            <Dialog.Header py="5">
              <Dialog.Title fontSize="xl" fontWeight="bold">
                {isEdit ? "Редактировать шаблон" : "Добавить шаблон"}
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton
                  size="sm"
                  color="gray.400"
                  _hover={{ color: "gray.600", bg: "gray.100" }}
                />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body p="6">
              <Stack gap="4">
                <Field.Root required>
                  <Field.Label fontWeight="semibold">Название</Field.Label>
                  <Input
                    placeholder="Приветствие абитуриента"
                    py="2.5"
                    rounded="lg"
                    value={form.title}
                    onChange={(e) => setField("title")(e.target.value)}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label fontWeight="semibold">Alias</Field.Label>
                  <Input
                    placeholder="welcome"
                    py="2.5"
                    rounded="lg"
                    fontFamily="mono"
                    value={form.alias}
                    onChange={(e) => setField("alias")(e.target.value)}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label fontWeight="semibold">Категория</Field.Label>
                  <Select.Root
                    collection={CATEGORIES}
                    value={form.category ? [form.category] : []}
                    onValueChange={(e) => setField("category")(e.value[0])}
                  >
                    <Select.Control>
                      <Select.Trigger rounded="lg" py="2.5">
                        <Select.ValueText placeholder="Выберите категорию" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content>
                        {CATEGORIES.items.map((cat) => (
                          <Select.Item item={cat} key={cat.value}>
                            {cat.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Field.Root>

                <Field.Root required>
                  <Field.Label fontWeight="semibold">Текст шаблона</Field.Label>
                  <RichTextEditor.Root
                    editor={editor}
                    borderWidth="1px"
                    rounded="lg"
                    width="full"
                    css={{
                      "& .ProseMirror": {
                        maxHeight: "10rem",
                        overflowY: "auto",
                      },
                    }}
                  >
                    <RichTextEditor.Toolbar>
                      <RichTextEditor.ControlGroup>
                        <Control.Bold />
                        <Control.Italic />
                        <Control.Underline />
                      </RichTextEditor.ControlGroup>
                      <RichTextEditor.ControlGroup>
                        <Control.BulletList />
                        <Control.OrderedList />
                      </RichTextEditor.ControlGroup>
                      <RichTextEditor.ControlGroup>
                        <Control.Undo />
                        <Control.Redo />
                      </RichTextEditor.ControlGroup>
                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content />
                  </RichTextEditor.Root>
                </Field.Root>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer p="6" gap="3">
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="subtle"
                  flex="1"
                  py="2.5"
                  rounded="lg"
                  bg="gray.100"
                  _hover={{ bg: "gray.200" }}
                >
                  Отмена
                </Button>
              </Dialog.ActionTrigger>
              <Button
                flex="1"
                py="2.5"
                rounded="lg"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                loading={isLoading}
              >
                {isEdit ? "Сохранить" : "Добавить"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
