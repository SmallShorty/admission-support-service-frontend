import { JSONContent } from "@tiptap/core";
import { AdmissionIntentCategory } from "@/features/tickets/model/types";

export interface Template {
  id: string;
  title: string;
  alias: string;
  content: JSONContent;
  category: AdmissionIntentCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplatesListResponse {
  items: Template[];
  total: number;
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
  createdBy: string;
}

export type UpdateTemplateDto = Partial<CreateTemplateDto>;

export interface ResolvedTemplateDto {
  id: string;
  alias: string;
  title: string;
  content: JSONContent;
  category: AdmissionIntentCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  missingVariables: string[];
}
