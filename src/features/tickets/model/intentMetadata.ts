import { AdmissionIntentCategory } from "./types";

export const INTENT_METADATA: Record<
  AdmissionIntentCategory,
  { label: string; color: string }
> = {
  [AdmissionIntentCategory.TECHNICAL_ISSUES]: {
    label: "Технические проблемы",
    color: "#3b82f6",
  },
  [AdmissionIntentCategory.DEADLINES_TIMELINES]: {
    label: "Сроки и дедлайны",
    color: "#8b5cf6",
  },
  [AdmissionIntentCategory.DOCUMENT_SUBMISSION]: {
    label: "Подача документов",
    color: "#ec4899",
  },
  [AdmissionIntentCategory.STATUS_VERIFICATION]: {
    label: "Проверка статуса",
    color: "#10b981",
  },
  [AdmissionIntentCategory.SCORES_COMPETITION]: {
    label: "Баллы и конкурс",
    color: "#f59e0b",
  },
  [AdmissionIntentCategory.PAYMENTS_CONTRACTS]: {
    label: "Оплата и договоры",
    color: "#ef4444",
  },
  [AdmissionIntentCategory.ENROLLMENT]: {
    label: "Зачисление",
    color: "#06b6d4",
  },
  [AdmissionIntentCategory.DORMITORY_HOUSING]: {
    label: "Общежитие",
    color: "#84cc16",
  },
  [AdmissionIntentCategory.STUDIES_SCHEDULE]: {
    label: "Учеба и расписание",
    color: "#a855f7",
  },
  [AdmissionIntentCategory.EVENTS]: {
    label: "Мероприятия",
    color: "#f97316",
  },
  [AdmissionIntentCategory.GENERAL_INFO]: {
    label: "Общая информация",
    color: "#14b8a6",
  },
  [AdmissionIntentCategory.PROGRAM_CONSULTATION]: {
    label: "Консультация по программам",
    color: "#6366f1",
  },
};
