import { config } from "@/lib/config";
import type { CreateProfileSchema } from "@/lib/schemas/profiles.schema";

type Action =
  | {
      type: "get";
    }
  | {
      type: "create";
      profileData: CreateProfileSchema;
    }
  | {
      type: "delete";
      id: number;
    }
  | {
      type: "update";
      id: number;
      fields: Partial<CreateProfileSchema>;
    };

export const runProfilesFetch = (action: Action): Promise<Response> => {
  const reqInit: RequestInit = {
    credentials: "include",
  };
  console.log(action);
  let url = `${config.server.url}/profiles`;
  switch (action.type) {
    case "create": {
      reqInit.body = action.profileData as unknown as BodyInit;
      reqInit.method = "POST";
      break;
    }
    case "get": {
      reqInit.method = "get";
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

  return fetch(url, reqInit);
};
