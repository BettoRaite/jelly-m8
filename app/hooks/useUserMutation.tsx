import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateUserSchema } from "@/lib/schemas/users.schema";
import { config, queryKeys } from "@/lib/config";

const fetchApi = async (url: string, options: RequestInit) => {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${await response.text()}`);
  }
  return await response.json();
};

type Action =
  | {
      id?: number;
      type: "create";
      payload: CreateUserSchema;
    }
  | {
      type: "delete";
      id: number;
    }
  | {
      type: "update";
      id: number;
      payload: Partial<CreateUserSchema>;
    }
  | {
      type: "invalidate-access-key";
      id: number;
    };

type UserMutationReturn = {
  [key: string]: ReturnType<typeof useMutation>;
};
export const useUserMutation = (action: Action) => {
  const queryClient = useQueryClient();

  let url = `${config.server.url}/users${action.id ? `/${action.id}` : ""}`;
  let method = "";
  let payload = null;

  switch (action.type) {
    case "create": {
      method = "post";
      payload = action.payload;
      break;
    }
    case "update": {
      method = "patch";
      payload = action.payload;
      break;
    }
    case "delete": {
      method = "delete";
      break;
    }
    case "invalidate-access-key": {
      method = "patch";
      url += "/access-token/invalidate";
      break;
    }
  }
  const actionNameformatted = action.type
    .split("-")
    .map((w) => {
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join("");

  return {
    [`user${actionNameformatted}Mutation`]: useMutation({
      mutationFn: async () => {
        return await fetchApi(url, {
          method: method.toUpperCase(),
          body: payload as BodyInit,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.usersKey,
        });
      },
    }),
  };
};
