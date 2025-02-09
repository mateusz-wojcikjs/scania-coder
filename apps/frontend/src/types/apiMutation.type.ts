import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "@scania-coder/types";

export type ApiMutation<TData, TVariables> = UseMutationResult<TData, AxiosError<ApiError>, TVariables>;
