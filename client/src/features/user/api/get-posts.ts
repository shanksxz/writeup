import { api } from "@/lib/api-client";
import type { Post } from "@/types";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

export type GetUserPostsParams = {
    page?: number;
    limit: number;
};

type Pagination = {
    total: number;
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

type UserPostsResponse = {
    success: boolean;
    data: {
        posts: Post[];
        pagination: Pagination;
    };
};

export const getUserPosts = async ({ page = 1, limit }: GetUserPostsParams): Promise<UserPostsResponse> => {
    return api.get("/user/posts", {
        params: { page, limit },
    });
};

export const getInfiniteUserPostsQueryOptions = (params: Omit<GetUserPostsParams, "page">) => {
    return infiniteQueryOptions({
        queryKey: ["user-posts"],
        queryFn: ({ pageParam = 1 }) => getUserPosts({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            if (!lastPage.success) return undefined;
            const { pagination } = lastPage.data;
            return pagination.hasNextPage ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 1,
    });
};

export const useInfiniteUserPosts = ({ limit }: Omit<GetUserPostsParams, "page">) => {
    return useInfiniteQuery(getInfiniteUserPostsQueryOptions({ limit }));
};
