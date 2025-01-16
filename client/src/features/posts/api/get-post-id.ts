import { api } from "@/lib/api-client";
import type { Post } from "@/types";
import { useQuery } from "@tanstack/react-query";

type PostDetailResponse = {
    post: Post;
    likeStatus: "liked" | "unliked";
};

export const getPostById = async (id: string): Promise<PostDetailResponse> => {
    return api.get(`/posts/${id}`);
};

export const postKeys = {
    detail: (id: string) => ["post", id] as const,
};

export const usePost = (id: string | undefined) => {
    return useQuery({
        queryKey: postKeys.detail(id as string),
        queryFn: () => getPostById(id as string),
        enabled: !!id,
    });
};
