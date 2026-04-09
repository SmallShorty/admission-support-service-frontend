import { JSONContent } from "@tiptap/core";
import { AdmissionIntentCategory } from "@/features/tickets/model/types";

export interface Template {
  id: string;
  title: string;
  alias: string;
  content: JSONContent;
  category: AdmissionIntentCategory;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplatesQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: AdmissionIntentCategory;
  includeInactive?: boolean;
}

export interface CreateTemplateDto {
  title: string;
  alias: string;
  content: JSONContent;
  category: AdmissionIntentCategory;
}

export type UpdateTemplateDto = Partial<CreateTemplateDto>;
