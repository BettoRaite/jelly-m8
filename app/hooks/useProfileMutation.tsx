import type { CreateProfileSchema } from "@/lib/schemas/profiles.schema";
import { fetchApi } from "@/lib/fetchApi";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { config, queryKeys } from "@/lib/config";
type Action =
  | {
      id?: number;
      type: "create";
    }
  | {
      type: "delete";
      id: number;
    }
  | {
      type: "update";
      id: number;
    };

type UserMutationReturn = {
  [key: string]: ReturnType<typeof useMutation>;
};

export const useProfileMutation = (action: Action) => {
  const queryClient = useQueryClient();

  const url = `${config.server.url}/profiles${
    action.id ? `/${action.id}` : ""
  }`;
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
  }
  const actionNameformatted = action.type
    .split("-")
    .map((w) => {
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join("");

  return {
    [`profile${actionNameformatted}Mutation`]: useMutation({
      mutationFn: async () => {
        return await fetchApi(url, {
          method: method.toUpperCase(),
          body: payload as BodyInit,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.profilesKey,
        });
      },
    }),
  };
};
