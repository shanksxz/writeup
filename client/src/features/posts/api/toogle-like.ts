import { api } from "@/lib/api-client";
import type { Post } from "@/types";
import { useMutation } from "@tanstack/react-query";

type PostDetailResponse = {
    post: Post;
    likeStatus: "liked" | "unliked";
};

export const likePost = async (postId: string): Promise<PostDetailResponse> => {
    return api.post(`/posts/${postId}/like`);
};

export const useLikePost = () => {
    return useMutation({
        mutationFn: likePost,
    });
};
