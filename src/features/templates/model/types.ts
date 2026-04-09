import { AdmissionIntentCategory } from "@/features/tickets/model/types";

export interface Template {
  id: string | number;
  title: string;
  alias: string;
  content: string; // Markdown JSON string
  category: AdmissionIntentCategory;
  createdAt: string;
  updatedAt: string;
  author: string;
}
