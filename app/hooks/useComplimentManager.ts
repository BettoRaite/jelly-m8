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

// Custom hook to encapsulate compliment-related logic
export const useComplimentManager = (initialCompliment: Compliment) => {
  const queryClient = useQueryClient();
  const commonQueryParams = {
    profileId: initialCompliment.profileId,
    complimentId: initialCompliment.id,
  };

  // Queries
  const complimentQuery = useComplimentQuery(
    { type: "compliment", ...commonQueryParams },
    { initialData: initialCompliment }
  );

  const likeQuery = useLikeQuery({
    type: "has_liked",
    complimentId: initialCompliment.id,
  });

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
    const previousHasLiked = likeQuery.data;
    const previousCompliment = queryClient.getQueryData([
      QUERY_KEYS.COMPLIMENTS,
      commonQueryParams,
    ]);

    try {
      // Optimistic update
      queryClient.setQueryData(
        ["like", { complimentId: commonQueryParams.complimentId }],
        (old: boolean) => !old
      );

      await likeMutation.mutateAsync({
        type: previousHasLiked ? "delete" : "create",
        complimentId: commonQueryParams.complimentId,
      });

      // Refresh both queries after successful mutation
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLIMENTS],
      });
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(
        [QUERY_KEYS.LIKES, initialCompliment.id],
        previousHasLiked
      );
      queryClient.setQueryData(
        [
          QUERY_KEYS.COMPLIMENTS,
          initialCompliment.profileId,
          initialCompliment.id,
        ],
        previousCompliment
      );
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
      toast.success("Compliment updated successfully");
    } catch (error) {
      toast.error("Failed to update compliment", { position: "bottom-center" });
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
    },
    actions: {
      toggleLike,
      handleDelete,
      handleUpdate,
      setIsEditing,
    },
  };
};
