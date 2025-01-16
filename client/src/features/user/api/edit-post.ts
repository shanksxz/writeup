import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Post } from "@/types";
import { useMutation } from "@tanstack/react-query";

type UpdatePostData = {
    postId: string;
    title: string;
    content: string;
};

export const updatePost = async ({ postId, title, content }: UpdatePostData): Promise<Post> => {
    return api.put(`/posts/${postId}`, { title, content });
};

export const useUpdatePost = (config?: MutationConfig<typeof updatePost>) => {
    return useMutation({
        mutationFn: updatePost,
        ...config,
    });
};
