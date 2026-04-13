import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface AccountCreatedModalProps {
  open: boolean;
  onClose: () => void;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const buildMessage = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) =>
  `Уважаемый(-ая) ${lastName} ${firstName}!\n\nВаш аккаунт в системе поддержки поступающих успешно создан. Ниже приведены данные для первого входа:\n\nEmail: ${email}\nПароль: ${password}\n\nС уважением,\nАдминистрация`;

export const AccountCreatedModal = ({
  open,
  onClose,
  firstName,
  lastName,
  email,
  password,
}: AccountCreatedModalProps) => {
  const [copied, setCopied] = useState(false);
  const message = buildMessage(firstName, lastName, email, password);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
      motionPreset="slide-in-bottom"
      unmountOnExit
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="2xl" boxShadow="2xl">
            <Dialog.Header py="5">
              <Dialog.Title fontSize="xl" fontWeight="bold">
                Аккаунт успешно создан
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
                <Text color="gray.600" fontSize="sm">
                  Скопируйте сообщение ниже и направьте сотруднику — в нём
                  содержатся данные для первого входа в систему.
                </Text>
                <Box
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  rounded="lg"
                  p="4"
                  whiteSpace="pre-wrap"
                  fontSize="sm"
                  fontFamily="mono"
                  color="gray.800"
                >
                  {message}
                </Box>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer p="6" gap="3">
              <Button
                colorPalette={copied ? "green" : "blue"}
                flex="1"
                py="2.5"
                rounded="lg"
                onClick={handleCopy}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Скопировано" : "Скопировать"}
              </Button>
              <Button
                variant="subtle"
                flex="1"
                py="2.5"
                rounded="lg"
                bg="gray.100"
                _hover={{ bg: "gray.200" }}
                onClick={onClose}
              >
                Закрыть
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
