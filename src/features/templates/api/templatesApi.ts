import { coreApi } from "@/shared/axiosInstance";
import {
  CreateTemplateDto,
  ResolvedTemplateDto,
  Template,
  TemplatesListResponse,
  TemplatesQueryParams,
  UpdateTemplateDto,
} from "../model/types";

export const templatesApi = {
  getTemplates: async (params: TemplatesQueryParams): Promise<TemplatesListResponse> => {
    const { data } = await coreApi.get<TemplatesListResponse>("/templates", { params });
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

  resolveTemplateByAlias: async (alias: string, ticketId: string): Promise<ResolvedTemplateDto> => {
    const { data } = await coreApi.get<ResolvedTemplateDto>(
      `/templates/alias/${alias}/resolve`,
      { params: { ticketId } },
    );
    return data;
  },
};
