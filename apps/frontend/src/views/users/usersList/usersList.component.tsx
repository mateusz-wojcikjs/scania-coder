import { MainTemplate } from "../../../components";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "../../../api";

export const UsersList = (): JSX.Element => {
  const queryClient = useQueryClient();
  const { isPending, data: users, error } = useQuery({ queryKey: ["users"], queryFn: getUsers });

  return (
    <MainTemplate>
      <h1>UsersList</h1>
      {isPending && <div>Loading...</div>}
      {users && <div>{users.length}</div>}
      {error && <div>{error.message}</div>}
    </MainTemplate>
  );
};

