import { QUERY_KEYS } from "@/lib/config";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithHandler } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import type { ApiError } from "@/lib/errors";
import { constructQueryString } from "@/lib/utils/strings";

type Action =
  | {
      type: "profiles";
      searchParams?: string;
    }
  | {
      type: "profile";
      userId: number;
    };

function useProfileQuery(
  action: {
    type: "profiles";
    searchParams?: string;
  },
  queryOptions?: Partial<
    UseQueryOptions<Profile[], ApiError, Profile[], string[]>
  >
): UseQueryResult<Profile[], ApiError>;

function useProfileQuery(
  action: {
    type: "profile";
    userId: number;
  },
  queryOptions?: Partial<UseQueryOptions<Profile, ApiError, Profile, string[]>>
): UseQueryResult<Profile, ApiError>;

function useProfileQuery(
  action: Action,
  queryOptions: Partial<UseQueryOptions<Profile[] | Profile, ApiError>> = {}
): UseQueryResult<Profile[] | Profile, ApiError> {
  let queryKey: readonly string[];
  let queryString = "";

  if (action.type === "profiles") {
    queryString = constructQueryString(action.searchParams ?? "");
    const q = [QUERY_KEYS.profilesKey[0], queryString];
    queryKey = q;
    console.log(queryKey);
  } else {
    queryKey = QUERY_KEYS.createProfileKey(action.userId);
  }

  return useQuery<Profile[] | Profile, ApiError>({
    ...queryOptions,
    queryKey,
    queryFn: async () => {
      switch (action.type) {
        case "profiles": {
          const url = `/profiles${queryString}`;
          const response = await fetchWithHandler<{ data: Profile[] }>(url);
          return response.data;
        }
        case "profile": {
          const response = await fetchWithHandler<{ data: Profile }>(
            `/users/${action.userId}/profile`
          );
          return response.data;
        }
        default: {
          throw new TypeError("Invalid useProfileQuery action type");
        }
      }
    },
  });
}

export default useProfileQuery;
