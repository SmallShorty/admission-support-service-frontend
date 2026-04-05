import { Card, Text, Field, Input, Stack, Button } from "@chakra-ui/react";
import { FC, useState } from "react";

export const LoginPage: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Данные для входа:", { email, password });
    // Здесь будет логика отправки данных на бэкенд
  };

  return (
    <Card.Root maxW="sm" variant="outline">
      <Card.Header>
        <Card.Title>Вход в систему</Card.Title>
        <Card.Description>
          Введите свои данные для доступа к сервису
        </Card.Description>
      </Card.Header>

      <Card.Body>
        <Stack gap="4">
          <Field.Root>
            <Field.Label>
              Электронная почта
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>
              Пароль
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </Field.Root>
        </Stack>
      </Card.Body>

      <Card.Footer justifyContent="flex-end">
        <Button width="full" onClick={handleLogin}>
          Войти
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};
