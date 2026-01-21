import { PaginatedResponse, User } from "@scania-coder/types";
import { useQuery, UseQueryResult, useMutation, useQueryClient } from "@tanstack/react-query";
import { UseUsers } from "../interfaces";
import { cancelInvitation, deactivateUser, deleteUser, getUsers, resendInvitation } from "../api/requests";
import { message } from "antd";
import { ApiMutation } from "../types";
import { TransProps, useTranslation } from "react-i18next";

export const useUsers = (): UseUsers => {
  const { data, isLoading, error }: UseQueryResult<PaginatedResponse<User>, Error> = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const queryClient = useQueryClient();
  const { t }: TransProps<never> = useTranslation();

  const deactivateUserMutation: ApiMutation<void, number> = useMutation({
    mutationFn: deactivateUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error(t("sc.fe.user.deactivateError"));
    },
  });

  const cancelInvitationMutation: ApiMutation<void, number> = useMutation({
    mutationFn: cancelInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error(t("sc.fe.user.cancelInvitationError"));
    },
  });

  const handleDeactivate = async (user: User) => {
    try {
      await deactivateUserMutation.mutateAsync(user.id);
      message.success(t("sc.fe.user.deactivateSuccess", { username: user.username }));
    } catch (error) {
      console.error(error);
    }
  };

  const resendInvitationMutation: ApiMutation<void, number> = useMutation({
    mutationFn: resendInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error(t("sc.fe.user.resendInvitationError"));
    },
  });

  const handleResendInvitation = async (user: User) => {
    try {
      await resendInvitationMutation.mutateAsync(user.id);
      message.success(t("sc.fe.user.resendInvitationSuccess", { username: user.username }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelInvitation = async (user: User) => {
    try {
      await cancelInvitationMutation.mutateAsync(user.id);
      message.success(t("sc.fe.user.cancelInvitationSuccess", { username: user.username }));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUserMutation: ApiMutation<void, number> = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error(t("sc.fe.user.deleteUserError"));
    },
  });

  const handleDeleteUser = async (user: User) => {
    try {
      await deleteUserMutation.mutateAsync(user.id);
      message.success(t("sc.fe.user.deleteUserSuccess", { username: user.username }));
    } catch (error) {
      console.error(error);
    }
  };

  return {
    users: data?.data || [],
    isLoading,
    actionLoading: deactivateUserMutation.isPending || cancelInvitationMutation.isPending || resendInvitationMutation.isPending || deleteUserMutation.isPending,
    error,
    handleDeactivate,
    handleCancelInvitation,
    handleResendInvitation,
    handleDeleteUser,
  };
};