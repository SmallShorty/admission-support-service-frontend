import { TemplatesQueryParams } from "../../model/types";

export const templateKeys = {
  all: ["templates"] as const,
  list: (params: TemplatesQueryParams) =>
    [...templateKeys.all, "list", params] as const,
  byAlias: (alias: string) => [...templateKeys.all, "alias", alias] as const,
};
