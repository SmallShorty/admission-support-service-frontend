import { coreApi } from "@/shared/axiosInstance";
import { Variable } from "../model/types";

export const variablesApi = {
  getVariables: async (): Promise<Variable[]> => {
    const { data } = await coreApi.get<Variable[]>("/variables");
    return data;
  },
};
