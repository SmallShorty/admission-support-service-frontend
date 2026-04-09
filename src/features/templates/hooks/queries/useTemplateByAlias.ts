import { useQuery } from "@tanstack/react-query";
import { templatesApi } from "../../api/templatesApi";
import { templateKeys } from "./queryKeys";

export const useTemplateByAlias = (alias: string) => {
  return useQuery({
    queryKey: templateKeys.byAlias(alias),
    queryFn: () => templatesApi.getTemplateByAlias(alias),
    enabled: !!alias,
  });
};
