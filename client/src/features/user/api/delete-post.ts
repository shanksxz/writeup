import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export const deletePost = async (postId: string): Promise<void> => {
    return api.delete(`/posts/${postId}`);
};

export const useDeletePost = (config?: MutationConfig<typeof deletePost>) => {
    return useMutation({
        mutationFn: deletePost,
        ...config,
    });
};
