# Integrations Feature — API Layer Reference

## Overview

Два домена: **Integrations** (CRUD + activate/deactivate, только ADMIN) и **Notifications** (read-only, ADMIN/SUPERVISOR).
Плюс **публичная форма** — без авторизации, через slug.

---

## Типы (`features/integrations/model/types.ts`)

```ts
enum EventType        { INFORMATIONAL, FAILURE }
enum NotificationStatus { PENDING, SENT, FAILED }

interface IntegrationDto {
  id: string
  slug: string           // уникальный, kebab-case
  name: string
  eventType: EventType
  theme: string
  source: string         // URL вебхука
  content: Record<string, unknown>  // JSON-тело запроса
  isActive: boolean
  isTypeEditable: boolean
  isThemeEditable: boolean
  isSourceEditable: boolean
  isContentEditable: boolean
  createdAt: string
  updatedAt: string
}

interface NotificationDto {
  id: string
  integrationId: string
  payload: {
    eventType: EventType
    theme: string
    source: string
    content: Record<string, unknown>
  }
  status: NotificationStatus  // PENDING | SENT | FAILED
  error: string | null        // заполнен при FAILED
  sentAt: string | null       // заполнен при SENT
  createdAt: string
}
```

---

## Query Hooks

### `useIntegrations(filters?)`
```ts
import { useIntegrations } from "@features/integrations/hooks/queries/useIntegrations"

const { data, isLoading, isError } = useIntegrations({
  searchTerm: "telegram",   // поиск по name/slug
  eventType: EventType.FAILURE,
  page: 1,
  limit: 20,
})

// data: { items: IntegrationDto[], total: number }
```

---

### `useIntegration(id)`
```ts
import { useIntegration } from "@features/integrations/hooks/queries/useIntegration"

const { data, isLoading } = useIntegration(id)
// data: IntegrationDto | undefined
// enabled: только когда id не пустой
```

---

### `useIntegrationBySlug(slug)`
```ts
import { useIntegrationBySlug } from "@features/integrations/hooks/queries/useIntegrationBySlug"

const { data, isLoading } = useIntegrationBySlug(slug)
// data: IntegrationDto | undefined
// Используется в admin-UI когда известен slug, а не id
```

---

### `usePublicIntegration(slug)`
```ts
import { usePublicIntegration } from "@features/integrations/hooks/queries/usePublicIntegration"

const { data, isLoading, isError } = usePublicIntegration(slug)
// data: IntegrationDto | undefined
// БЕЗ авторизации. isError = true при 404 (не найдено или деактивировано)
```

Флаги `is*Editable` из `data` определяют рендер полей формы:

| Флаг | false | true |
|---|---|---|
| `isTypeEditable` | `eventType` — read-only label | select: INFORMATIONAL / FAILURE |
| `isThemeEditable` | `theme` — read-only text | text input |
| `isSourceEditable` | `source` — read-only text | text input |
| `isContentEditable` | `content` — read-only JSON | editable textarea / JSON editor |

---

### `useNotifications(filters?)`
```ts
import { useNotifications } from "@features/integrations/hooks/queries/useNotifications"

const { data, isLoading } = useNotifications({
  integrationId: "uuid",               // фильтр по интеграции
  status: NotificationStatus.PENDING,  // PENDING | SENT | FAILED
  page: 1,
  limit: 20,
})

// data: { items: NotificationDto[], total: number }
```

---

### `useNotification(id)`
```ts
import { useNotification } from "@features/integrations/hooks/queries/useNotification"

const { data, isLoading } = useNotification(id)
// data: NotificationDto | undefined
```

---

## Mutation Hooks

### `useCreateIntegration`
```ts
import { useCreateIntegration } from "@features/integrations/hooks/mutations/useCreateIntegration"

const { mutate, isPending } = useCreateIntegration()

mutate({
  slug: "telegram-failure-alert",   // обязательно, уникальный, /^[a-z0-9-]+$/
  name: "Telegram Failure Alerts",
  eventType: EventType.FAILURE,
  theme: "dark",
  source: "https://api.telegram.org/bot123/sendMessage",
  content: { text: "Ticket {{id}} failed", chatId: "-100123" },
  isTypeEditable: false,    // optional, default true
  isThemeEditable: true,
  isSourceEditable: false,
  isContentEditable: true,
})

// onSuccess: инвалидирует весь список интеграций
// Ошибка 409 — slug уже занят
```

---

### `useUpdateIntegration`
```ts
import { useUpdateIntegration } from "@features/integrations/hooks/mutations/useUpdateIntegration"

const { mutate, isPending } = useUpdateIntegration()

mutate({
  id: "uuid",
  payload: { name: "New Name", theme: "light" },  // все поля опциональны
})

// onSuccess: обновляет detail-кеш + инвалидирует список
// Ошибка 409 — новый slug уже занят
```

---

### `useActivateIntegration`
```ts
import { useActivateIntegration } from "@features/integrations/hooks/mutations/useActivateIntegration"

const { mutate, isPending } = useActivateIntegration()

mutate("uuid")
// onSuccess: обновляет detail-кеш, инвалидирует список
// После активации — публичная форма становится доступной
```

---

### `useDeactivateIntegration`
```ts
import { useDeactivateIntegration } from "@features/integrations/hooks/mutations/useDeactivateIntegration"

const { mutate, isPending } = useDeactivateIntegration()

mutate("uuid")
// onSuccess: обновляет detail-кеш, инвалидирует список
// После деактивации — GET /public/integrations/:slug вернёт 404
```

---

### `useSubmitPublicIntegration(slug)`
```ts
import { useSubmitPublicIntegration } from "@features/integrations/hooks/mutations/useSubmitPublicIntegration"

const { mutate, isPending, isSuccess, isError, error } =
  useSubmitPublicIntegration(slug)

mutate({
  theme: "light",           // только поля где is*Editable = true
  content: { chatId: "-100456" },
})

// Успех 201 → data: NotificationDto со status PENDING
// Ошибка 400 → submitted non-editable field
// Ошибка 404 → интеграция не найдена или деактивирована
```

**Правило**: отправлять только поля, где соответствующий `is*Editable === true` И пользователь изменил значение. Не-редактируемые поля сервер отклонит с 400.

---

## Shareable link

Публичная ссылка формируется на фронтенде из `slug`:

```ts
const publicUrl = `${window.location.origin}/integrations/public/${integration.slug}`
```

Показывать в admin-UI как кликабельную ссылку / кнопку копирования.

---

## Query Keys (для ручной инвалидации)

```ts
import { integrationKeys, notificationKeys } from
  "@features/integrations/hooks/queries/queryKeys"

integrationKeys.all            // ["integrations"] — инвалидирует всё
integrationKeys.list(filters)  // конкретный список
integrationKeys.detail(id)     // конкретная интеграция
integrationKeys.bySlug(slug)   // поиск по slug (admin)
integrationKeys.public(slug)   // публичная форма

notificationKeys.all           // ["notifications"]
notificationKeys.list(filters)
notificationKeys.detail(id)
```
