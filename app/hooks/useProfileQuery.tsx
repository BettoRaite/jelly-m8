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

type ProfileQueryAction =
  | {
      type: "profiles";
      searchParams?: string;
    }
  | {
      type: "profile";
      userId: number;
    };

function useProfileQuery(
  action: { type: "profiles"; searchParams?: string },
  options?: Partial<UseQueryOptions<Profile[] | Profile, ApiError>>
): UseQueryResult<Profile[], ApiError>;

function useProfileQuery(
  action: { type: "profile"; userId: number },
  options?: Partial<UseQueryOptions<Profile[] | Profile, ApiError>>
): UseQueryResult<Profile, ApiError>;

function useProfileQuery(
  action: ProfileQueryAction,
  options: Partial<UseQueryOptions<Profile[] | Profile, ApiError>> = {}
): UseQueryResult<Profile[] | Profile, ApiError> {
  const queryKey = (() => {
    switch (action.type) {
      case "profiles": {
        const qKey = [QUERY_KEYS.PROFILES];
        const qStr = constructQueryString(action.searchParams ?? "");
        if (action.searchParams) qKey.push(action.searchParams);
        return qKey;
      }
      case "profile":
        return [QUERY_KEYS.PROFILES, action.userId];
      default:
        throw new Error(`Invalid action type: ${action as never}`);
    }
  })();

  const queryFn = async () => {
    switch (action.type) {
      case "profiles": {
        const url = `/profiles${constructQueryString(
          action.searchParams ?? ""
        )}`;
        const response = await fetchWithHandler<{ data: Profile[] }>(url);
        return response.data;
      }
      case "profile": {
        const response = await fetchWithHandler<{ data: Profile }>(
          `/users/${action.userId}/profile`
        );
        return response.data;
      }
      default:
        throw new Error(`Invalid action type: ${action as never}`);
    }
  };

  return useQuery<Profile[] | Profile, ApiError>({
    ...options,
    queryKey,
    queryFn,
  });
}

export default useProfileQuery;
