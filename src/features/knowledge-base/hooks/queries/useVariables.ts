import { useQuery } from "@tanstack/react-query";
import { variablesApi } from "../../api/variablesApi";
import { variableKeys } from "./queryKeys";

export const useVariables = () => {
  return useQuery({
    queryKey: variableKeys.list(),
    queryFn: variablesApi.getVariables,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
