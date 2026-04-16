import React, { useRef, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { ChevronDown, Send, X } from "lucide-react";
import { chatSocket } from "../api/chatSocket";
import { useSendMessage, useTicketVariables } from "../hooks/chatQueries";
import { clearVariableError } from "../model/chatSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { toaster } from "@/shared/components/ui/toaster";
import { useTemplates } from "@features/templates/hooks/queries/useTemplates";
import { templatesApi } from "@features/templates/api/templatesApi";
import type { JSONContent } from "@tiptap/core";

interface ChatInputProps {
  ticketId: string;
  disabled?: boolean;
}

function extractTextFromTipTap(node: JSONContent): string {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "\n";
  const children = node.content?.map(extractTextFromTipTap).join("") ?? "";
  if (node.type === "paragraph" || node.type === "heading") return children + "\n";
  return children;
}

export const ChatInput = ({ ticketId, disabled = false }: ChatInputProps) => {
  const [content, setContent] = React.useState("");
  const [variableQuery, setVariableQuery] = React.useState<string | null>(null);
  const [activeVariableIndex, setActiveVariableIndex] = React.useState(0);
  const [templatePickerActive, setTemplatePickerActive] = React.useState(false);
  const [activeTemplateIndex, setActiveTemplateIndex] = React.useState(0);
  const [missingVariables, setMissingVariables] = React.useState<string[]>([]);
  const [isResolvingTemplate, setIsResolvingTemplate] = React.useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: sendMessage, isPending } = useSendMessage();
  const dispatch = useAppDispatch();
  const variableError = useAppSelector((state) => state.chat.variableError);

  const templatePickerOpen = templatePickerActive && content.startsWith("/");
  const templateSearchTerm = templatePickerOpen ? content.slice(1) : undefined;

  const { data: templatesData } = useTemplates(
    { searchTerm: templateSearchTerm || undefined, limit: 10 },
    { enabled: templatePickerOpen },
  );
  const pickerTemplates = templatePickerOpen ? (templatesData?.items ?? []) : [];

  const stopTyping = () => {
    if (isTypingRef.current) {
      chatSocket.sendTypingStatus(ticketId, false);
      isTypingRef.current = false;
    }
  };

  const getVariableQuery = (text: string, cursorPos: number): string | null => {
    const before = text.slice(0, cursorPos);
    const match = before.match(/\$([а-яёa-z_0-9]*)$/i);
    return match !== null ? match[1] : null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);

    if (!isTypingRef.current) {
      chatSocket.sendTypingStatus(ticketId, true);
      isTypingRef.current = true;
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(stopTyping, 2000);

    if (val.startsWith("/")) {
      if (!templatePickerActive) setTemplatePickerActive(true);
      setVariableQuery(null);
    } else {
      if (templatePickerActive) setTemplatePickerActive(false);
      const query = getVariableQuery(val, e.target.selectionStart);
      setVariableQuery(query);
    }
  };

  const handleSelectVariable = (varName: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const before = content.slice(0, cursorPos);
    const match = before.match(/\$[а-яёa-z_0-9]*$/i);
    if (!match) return;

    const matchLength = match[0].length;
    const insertStart = cursorPos - matchLength;
    const after = content.slice(cursorPos);
    const newContent = content.slice(0, insertStart) + `$${varName} ` + after;

    setContent(newContent);
    setVariableQuery(null);
    setActiveVariableIndex(0);

    setTimeout(() => {
      const newCursorPos = insertStart + varName.length + 2;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSelectTemplate = async (alias: string) => {
    setTemplatePickerActive(false);
    setActiveTemplateIndex(0);
    setIsResolvingTemplate(true);
    try {
      const resolved = await templatesApi.resolveTemplateByAlias(alias, ticketId);
      const text = extractTextFromTipTap(resolved.content).trim();
      setContent(text);
      setMissingVariables(resolved.missingVariables);
      setTimeout(() => textareaRef.current?.focus(), 0);
    } catch {
      toaster.create({ title: "Ошибка загрузки шаблона", type: "error" });
    } finally {
      setIsResolvingTemplate(false);
    }
  };

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed || isPending || disabled) return;

    stopTyping();
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    sendMessage({ ticketId, content: trimmed });
    setContent("");
    setVariableQuery(null);
    setActiveVariableIndex(0);
    setMissingVariables([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (templatePickerOpen && pickerTemplates.length > 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSelectTemplate(pickerTemplates[activeTemplateIndex].alias);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveTemplateIndex((i) => Math.min(i + 1, pickerTemplates.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveTemplateIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setTemplatePickerActive(false);
        return;
      }
    }

    if (dropdownOpen && filteredVariables.length > 0) {
      if (e.key === "Tab") {
        e.preventDefault();
        handleSelectVariable(filteredVariables[activeVariableIndex].name);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        handleSelectVariable(filteredVariables[activeVariableIndex].name);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveVariableIndex((i) => Math.min(i + 1, filteredVariables.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveVariableIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setVariableQuery(null);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey && !dropdownOpen && !templatePickerOpen) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const dropdownOpen = variableQuery !== null;
  const { data: variables } = useTicketVariables(ticketId, dropdownOpen);
  const filteredVariables =
    variables?.filter((v) =>
      v.name.toLowerCase().includes((variableQuery ?? "").toLowerCase()),
    ) ?? [];

  useEffect(() => {
    setActiveVariableIndex(0);
  }, [variableQuery]);

  useEffect(() => {
    setActiveTemplateIndex(0);
  }, [templateSearchTerm]);

  useEffect(() => {
    if (variableError) {
      toaster.create({
        title: "Ошибка подстановки переменных",
        description: `Не удалось подставить: ${variableError.missingVariables.join(", ")}`,
        type: "error",
      });
      dispatch(clearVariableError());
    }
  }, [variableError, dispatch]);

  return (
    <Box px="3" py="3" borderTopWidth="1px" borderColor="border.muted" flexShrink={0}>
      {missingVariables.length > 0 && (
        <Alert.Root status="warning" borderRadius="lg" mb="2" fontSize="xs">
          <Alert.Indicator />
          <Alert.Title flex="1" fontSize="xs" fontWeight="normal">
            Некоторые переменные не удалось подставить:{" "}
            {missingVariables.map((v) => `$${v}`).join(", ")}. Заполните их вручную перед отправкой.
          </Alert.Title>
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="Закрыть"
            onClick={() => setMissingVariables([])}
          >
            <X size={12} />
          </IconButton>
        </Alert.Root>
      )}

      <Box
        position="relative"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="border.muted"
        bg="bg.subtle"
        overflow="visible"
        boxShadow="sm"
        transition="all 0.2s"
        _focusWithin={{
          borderColor: "blue.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-blue-100)",
        }}
      >
        {templatePickerOpen && pickerTemplates.length > 0 && (
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
            maxH="260px"
            overflowY="auto"
            mb="1"
          >
            {pickerTemplates.map((t, idx) => (
              <Box
                key={t.id}
                px="3"
                py="2.5"
                cursor="pointer"
                bg={idx === activeTemplateIndex ? "bg.subtle" : undefined}
                _hover={{ bg: "bg.subtle" }}
                onClick={() => handleSelectTemplate(t.alias)}
              >
                <Flex justify="space-between" align="center" gap="2">
                  <Text fontSize="sm" fontWeight="semibold" color="fg">
                    {t.title}
                  </Text>
                  {idx === activeTemplateIndex && (
                    <Text
                      fontSize="xs"
                      color="fg.subtle"
                      bg="bg.muted"
                      px="1"
                      borderRadius="sm"
                    >
                      Enter
                    </Text>
                  )}
                </Flex>
                <Text fontFamily="mono" fontSize="xs" color="fg.muted">
                  /{t.alias}
                </Text>
              </Box>
            ))}
          </Box>
        )}

        {dropdownOpen && filteredVariables.length > 0 && (
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
            maxH="220px"
            overflowY="auto"
            mb="1"
          >
            {filteredVariables.map((v, idx) => (
              <Box
                key={v.name}
                px="3"
                py="2"
                cursor="pointer"
                bg={idx === activeVariableIndex ? "bg.subtle" : undefined}
                _hover={{ bg: "bg.subtle" }}
                onClick={() => handleSelectVariable(v.name)}
              >
                <Flex justify="space-between" align="baseline" gap="2">
                  <Flex align="center" gap="2">
                    <Text fontSize="sm" fontWeight="semibold" color="fg">
                      ${v.name}
                    </Text>
                    {idx === activeVariableIndex && (
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
                  <Text
                    fontSize="xs"
                    color="fg.muted"
                    truncate
                    flex="1"
                    textAlign="right"
                  >
                    {v.resolvedValue}
                  </Text>
                </Flex>
                <Text fontSize="xs" color="fg.subtle">
                  {v.description}
                </Text>
              </Box>
            ))}
          </Box>
        )}

        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение... (Нажмите '/' для вызова шаблонов)"
          resize="none"
          rows={3}
          bg="transparent"
          border="none"
          outline="none"
          boxShadow="none"
          _focus={{ boxShadow: "none" }}
          _focusVisible={{ boxShadow: "none" }}
          fontSize="sm"
          fontWeight="medium"
          color="fg"
          _placeholder={{ color: "fg.subtle" }}
          pb="10"
          disabled={disabled || isPending || isResolvingTemplate}
          css={{ overflow: "auto" }}
        />

        <Flex
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          align="center"
          justify="space-between"
          px="3"
          py="1.5"
          borderTopWidth="1px"
          borderColor="border.muted"
          bg="bg"
        >
          <Flex gap="2">
            <Button
              size="xs"
              variant="outline"
              colorPalette="gray"
              fontWeight="semibold"
              onClick={() => {
                setContent("/");
                setTemplatePickerActive(true);
                setTimeout(() => textareaRef.current?.focus(), 0);
              }}
            >
              <Text color="fg.muted" fontSize="xs">
                /
              </Text>
              Шаблоны
              <ChevronDown size={13} />
            </Button>
            <Button
              size="xs"
              variant="outline"
              colorPalette="gray"
              fontWeight="semibold"
              onClick={() => setVariableQuery("")}
            >
              <Text color="fg.muted" fontSize="xs">
                {"{ }"}
              </Text>
              Переменные
              <ChevronDown size={13} />
            </Button>
          </Flex>

          <IconButton
            aria-label="Отправить"
            onClick={handleSubmit}
            disabled={!content.trim() || isPending || disabled}
            borderRadius="lg"
            size="sm"
          >
            <Send size={16} />
          </IconButton>
        </Flex>
      </Box>
    </Box>
  );
};
