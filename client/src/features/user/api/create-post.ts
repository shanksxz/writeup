import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Post, PostForm } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const createPost = async (data: PostForm): Promise<Post> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("category", data.category);
    if (data.image && data.image instanceof FileList && data.image.length > 0) {
        formData.append("image", data.image[0]);
    }

    return api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const useCreatePost = (config?: MutationConfig<typeof createPost>) => {
    return useMutation({
        mutationFn: createPost,
        ...config,
    });
};
