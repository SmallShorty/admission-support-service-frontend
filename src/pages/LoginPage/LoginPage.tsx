import { authApi } from "@/app/entities/account/api/accountApi";
import { setAccount } from "@/app/entities/account/model/accountSlice";
import { useAppDispatch } from "@/app/hooks";
import { Card, Text, Field, Input, Stack, Button } from "@chakra-ui/react";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // 1. Отправляем запрос
      const data = await authApi.login({ email, password });

      dispatch(
        setAccount({
          account: data.account,
          accessToken: data.token,
        }),
      );

      // 3. Редирект на главную
      navigate("/");
    } catch (err: any) {
      console.log(err.response?.data?.message || "Ошибка при входе");
    }
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
