import { useComplimentMutation } from "@/hooks/useComplimentMutation";
import useComplimentQuery from "@/hooks/useComplimentQuery";
import { useLikeMutation } from "@/hooks/useLikeMutation";
import useLikeQuery from "@/hooks/useLikeQuery";
import { QUERY_KEYS } from "@/lib/config";
import {
  updateComplimentSchema,
  type UpdateComplimentPayload,
} from "@/lib/schemas/compliment.schema";
import type { Compliment } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useProfileQuery from "./useProfileQuery";
import { getAuth } from "./useAuth";

// Custom hook to encapsulate compliment-related logic
export const useComplimentManager = (initialCompliment: Compliment) => {
  const user = getAuth();
  const queryClient = useQueryClient();
  const commonQueryParams = {
    profileId: initialCompliment.profileId,
    complimentId: initialCompliment.id,
  };

  // Queries
  const complimentQuery = useComplimentQuery(
    { type: "compliment", ...commonQueryParams },
    { initialData: initialCompliment, enabled: Boolean(user) }
  );

  const likeQuery = useLikeQuery(
    {
      type: "has_liked",
      complimentId: initialCompliment.id,
    },
    {
      enabled: Boolean(user),
      initialData: false,
    }
  );

  // Mutations
  const complimentMutation = useComplimentMutation();
  const likeMutation = useLikeMutation();

  // Derived state
  const [isEditing, setIsEditing] = useState(false);
  const methods = useForm<UpdateComplimentPayload>({
    resolver: zodResolver(updateComplimentSchema),
    defaultValues: { content: initialCompliment.content },
  });

  // Sync form with latest data
  useEffect(() => {
    if (complimentQuery.data?.content) {
      methods.reset({ content: complimentQuery.data.content });
    }
  }, [complimentQuery.data?.content, methods]);

  // Like handling with optimistic updates
  const toggleLike = async () => {
    const { data } = complimentQuery;
    if (!data) return;

    const complimentQueryKey = [
      QUERY_KEYS.COMPLIMENTS,
      commonQueryParams.profileId,
      commonQueryParams.complimentId,
    ];
    const likeQueryKey = [QUERY_KEYS.LIKES, commonQueryParams.complimentId];
    const previousHasLiked = likeQuery.data;
    // Optimistic update
    queryClient.setQueryData(likeQueryKey, (old: boolean) => !old);
    queryClient.setQueryData(complimentQueryKey, (c: Compliment) => {
      return {
        ...c,
        author: { ...c.author },
        recipient: { ...c.recipient },
        likes: previousHasLiked ? c.likes - 1 : c.likes + 1,
      };
    });
    try {
      await likeMutation.mutateAsync({
        type: previousHasLiked ? "delete" : "create",
        complimentId: commonQueryParams.complimentId,
      });
      // Refresh both queries after successful mutation
      await queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.COMPLIMENTS,
          initialCompliment.profileId,
          initialCompliment.id,
        ],
      });
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(likeQueryKey, (old: boolean) => !old);
      queryClient.setQueryData(complimentQueryKey, (c: Compliment) => {
        return data;
      });
      throw error;
    }
  };

  // Mutation handlers
  const handleDelete = () => {
    complimentMutation.mutate(
      { type: "delete", ...commonQueryParams },
      {
        onError: () => {
          toast.error("Упс не удалось удалить комплимент.", {
            position: "bottom-center",
          });
        },
      }
    );
  };

  const handleUpdate = async (payload: UpdateComplimentPayload) => {
    try {
      await complimentMutation.mutateAsync({
        type: "update",
        ...commonQueryParams,
        payload,
      });
      setIsEditing(false);
      toast.success("Комплимент изменён");
    } catch (error) {
      toast.error("Ошибка при изменении комплимента", {
        position: "bottom-center",
      });
    }
  };

  return {
    states: {
      compliment: complimentQuery.data,
      complimentQueryLoadStatus: complimentQuery.status,
      hasLiked: likeQuery.data,
      likeQueryLoadStatus: likeQuery.status,
      isEditing,
      formMethods: methods,
      isDeleting: complimentMutation.isPending,
      isUpdating: complimentMutation.isPending,
      isLiking: likeMutation.isPending,
      likeMutation,
    },
    actions: {
      toggleLike,
      handleDelete,
      handleUpdate,
      setIsEditing,
    },
  };
};
