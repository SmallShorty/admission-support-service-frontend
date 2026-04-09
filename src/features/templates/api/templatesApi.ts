import { coreApi } from "@/shared/axiosInstance";
import { PaginatedResponse } from "@/shared/types/pagination";
import {
  CreateTemplateDto,
  Template,
  TemplatesQueryParams,
  UpdateTemplateDto,
} from "../model/types";

export const templatesApi = {
  getTemplates: async (params: TemplatesQueryParams): Promise<PaginatedResponse<Template>> => {
    const { data } = await coreApi.get<PaginatedResponse<Template>>("/templates", { params });
    return data;
  },

  getTemplateByAlias: async (alias: string): Promise<Template> => {
    const { data } = await coreApi.get<Template>(`/templates/alias/${alias}`);
    return data;
  },

  createTemplate: async (dto: CreateTemplateDto): Promise<Template> => {
    const { data } = await coreApi.post<Template>("/templates", dto);
    return data;
  },

  updateTemplate: async (id: string, dto: UpdateTemplateDto): Promise<Template> => {
    const { data } = await coreApi.patch<Template>(`/templates/${id}`, dto);
    return data;
  },

  deactivateTemplate: async (id: string): Promise<Template> => {
    const { data } = await coreApi.patch<Template>(`/templates/${id}/deactivate`);
    return data;
  },

  activateTemplate: async (id: string): Promise<Template> => {
    const { data } = await coreApi.patch<Template>(`/templates/${id}/activate`);
    return data;
  },
};
