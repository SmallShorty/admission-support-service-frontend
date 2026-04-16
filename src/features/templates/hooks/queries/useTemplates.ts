import { useQuery } from "@tanstack/react-query";
import { templatesApi } from "../../api/templatesApi";
import { TemplatesQueryParams } from "../../model/types";
import { templateKeys } from "./queryKeys";

export const useTemplates = (params: TemplatesQueryParams = {}, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: templateKeys.list(params),
    queryFn: () => templatesApi.getTemplates(params),
    enabled: options?.enabled !== false,
  });
};
