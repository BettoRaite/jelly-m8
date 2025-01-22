import { config } from "@/lib/config";
import type { CreateUserSchema } from "@/lib/schemas/users.schema";

type Action =
  | {
      type: "create";
      creds: CreateUserSchema;
    }
  | {
      type: "delete";
      id: number;
    }
  | {
      type: "update";
      id: number;
      fields: Partial<CreateUserSchema>;
    };

export const createMutateUsersFn = (action: Action) => {
  return async () => {
    const reqInit: RequestInit = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };
    let url = `${config.server.url}/users`;
    switch (action.type) {
      case "create": {
        reqInit.body = JSON.stringify(action.creds);
        reqInit.method = "post";
        break;
      }
      case "update": {
        reqInit.body = JSON.stringify(action.fields);
        reqInit.method = "patch";
        url += `/${action.id}`;
        break;
      }
      case "delete": {
        reqInit.method = "delete";
        url += `/${action.id}`;
        break;
      }
    }
    const response = await fetch(url, reqInit);
    if (!response.ok) {
      throw new Error(
        `Failed to perform action: ${action}\n${await response.text()}`
      );
    }
    return await response.json();
  };
};
