import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Input,
  Portal,
  Select,
  Stack,
  Text,
  createListCollection,
} from "@chakra-ui/react";
import Placeholder from "@tiptap/extension-placeholder";
import { Editor, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { INTENT_METADATA } from "@features/tickets/model/intentMetadata";
import { AdmissionIntentCategory } from "@features/tickets/model/types";
import {
  Control,
  RichTextEditor,
} from "@shared/components/ui/rich-text-editor";
import { useVariables } from "@features/knowledge-base/hooks/queries/useVariables";
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
  onDeactivate?: () => void;
  onActivate?: () => void;
  isDeactivating?: boolean;
  isActivating?: boolean;
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

function getEditorVariableQuery(editor: Editor): string | null {
  const { $anchor } = editor.state.selection;
  const textBefore = editor.state.doc.textBetween($anchor.start(), $anchor.pos, "");
  const match = textBefore.match(/\$([а-яёa-z_0-9]*)$/i);
  return match !== null ? match[1] : null;
}

function insertVariableInEditor(editor: Editor, varName: string): void {
  const { $anchor } = editor.state.selection;
  const textBefore = editor.state.doc.textBetween($anchor.start(), $anchor.pos, "");
  const match = textBefore.match(/\$[а-яёa-z_0-9]*$/i);
  if (!match) return;
  const from = $anchor.pos - match[0].length;
  editor
    .chain()
    .focus()
    .deleteRange({ from, to: $anchor.pos })
    .insertContent(`$${varName} `)
    .run();
}

export const TemplateInfoModal = ({
  open,
  onOpenChange,
  template,
  onSave,
  isLoading = false,
  onDeactivate,
  onActivate,
  isDeactivating = false,
  isActivating = false,
}: TemplateInfoModalProps) => {
  const isEdit = !!template;

  const [form, setForm] = useState({
    title: template?.title ?? "",
    alias: template?.alias ?? "",
    category:
      (template as any)?.category ?? AdmissionIntentCategory.GENERAL_INFO,
  });

  const [varSuggestion, setVarSuggestion] = useState<string | null>(null);
  const [activeVarIdx, setActiveVarIdx] = useState(0);

  const { data: variables } = useVariables();

  // Refs used by TipTap's handleKeyDown (avoids stale closures)
  const editorRef = useRef<Editor | null>(null);
  const varSuggestionRef = useRef<string | null>(null);
  const activeVarIdxRef = useRef(0);
  const filteredVarsRef = useRef<typeof filteredVars>([]);

  const filteredVars =
    variables?.filter((v) =>
      v.name.toLowerCase().includes((varSuggestion ?? "").toLowerCase()),
    ) ?? [];

  // Keep refs in sync with render-time values
  varSuggestionRef.current = varSuggestion;
  activeVarIdxRef.current = activeVarIdx;
  filteredVarsRef.current = filteredVars;

  const handleSelectVar = (varName: string) => {
    if (!editorRef.current) return;
    insertVariableInEditor(editorRef.current, varName);
    setVarSuggestion(null);
    setActiveVarIdx(0);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Введите текст шаблона..." }),
    ],
    content: template?.content ? normalizeContent(template.content) : "",
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      const query = getEditorVariableQuery(e);
      setVarSuggestion(query);
      if (query === null) setActiveVarIdx(0);
    },
    editorProps: {
      handleKeyDown: (_view, event) => {
        if (varSuggestionRef.current === null) return false;
        const vars = filteredVarsRef.current;
        if (vars.length === 0) return false;

        if (event.key === "Tab" || event.key === "Enter") {
          const varName = vars[activeVarIdxRef.current]?.name;
          if (varName && editorRef.current) {
            insertVariableInEditor(editorRef.current, varName);
            setVarSuggestion(null);
            setActiveVarIdx(0);
          }
          return true;
        }
        if (event.key === "ArrowDown") {
          setActiveVarIdx((i) => Math.min(i + 1, filteredVarsRef.current.length - 1));
          return true;
        }
        if (event.key === "ArrowUp") {
          setActiveVarIdx((i) => Math.max(i - 1, 0));
          return true;
        }
        if (event.key === "Escape") {
          setVarSuggestion(null);
          return true;
        }
        return false;
      },
    },
  });

  // Keep editorRef in sync
  editorRef.current = editor;

  useEffect(() => {
    if (!open) return;
    setForm({
      title: template?.title ?? "",
      alias: template?.alias ?? "",
      category:
        (template as any)?.category ?? AdmissionIntentCategory.GENERAL_INFO,
    });
    setVarSuggestion(null);
    setActiveVarIdx(0);
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
                  <Box position="relative" width="full">
                    {varSuggestion !== null && filteredVars.length > 0 && (
                      <Box
                        position="absolute"
                        bottom="100%"
                        left="0"
                        right="0"
                        zIndex="popover"
                        bg="bg"
                        borderWidth="1px"
                        borderColor="border.muted"
                        borderRadius="lg"
                        boxShadow="md"
                        maxH="200px"
                        overflowY="auto"
                        mb="1"
                      >
                        {filteredVars.map((v, idx) => (
                          <Box
                            key={v.name}
                            px="3"
                            py="2"
                            cursor="pointer"
                            bg={idx === activeVarIdx ? "bg.subtle" : undefined}
                            _hover={{ bg: "bg.subtle" }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectVar(v.name);
                            }}
                          >
                            <Flex justify="space-between" align="baseline" gap="2">
                              <Flex align="center" gap="2">
                                <Text
                                  fontFamily="mono"
                                  fontSize="sm"
                                  fontWeight="semibold"
                                  color="teal.fg"
                                >
                                  ${v.name}
                                </Text>
                                {idx === activeVarIdx && (
                                  <Text
                                    fontSize="xs"
                                    color="fg.subtle"
                                    bg="bg.muted"
                                    px="1"
                                    borderRadius="sm"
                                  >
                                    Tab
                                  </Text>
                                )}
                              </Flex>
                            </Flex>
                            <Text fontSize="xs" color="fg.subtle">
                              {v.description}
                            </Text>
                          </Box>
                        ))}
                      </Box>
                    )}
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
                  </Box>
                </Field.Root>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer p="6" gap="3">
              {isEdit && template?.isActive && (
                <Button
                  variant="subtle"
                  colorPalette="red"
                  py="2.5"
                  rounded="lg"
                  onClick={onDeactivate}
                  loading={isDeactivating}
                  disabled={isLoading || isActivating}
                >
                  Деактивировать
                </Button>
              )}
              {isEdit && !template?.isActive && (
                <Button
                  variant="subtle"
                  colorPalette="green"
                  py="2.5"
                  rounded="lg"
                  onClick={onActivate}
                  loading={isActivating}
                  disabled={isLoading || isDeactivating}
                >
                  Активировать
                </Button>
              )}
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
