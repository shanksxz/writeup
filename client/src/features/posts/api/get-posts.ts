import { api } from "@/lib/api-client";
import type { Post, SearchParams } from "@/types";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";

export type PaginationParams = {
    page?: number;
    limit: number;
};

export type GetPostsParams = PaginationParams & {
    searchParams?: SearchParams;
};

export type PostResponse = {
    success: boolean;
    data: {
        posts: Post[];
        pagination: [
            {
                total: number;
                currentPage: number;
                totalPages: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            },
        ];
    };
};

export const getPosts = async ({ page = 1, limit, searchParams = {} }: GetPostsParams): Promise<PostResponse> => {
    return api.get("/posts/search", {
        params: {
            page,
            limit,
            ...(searchParams.search && { search: searchParams.search }),
            ...(searchParams.searchField && {
                searchField: searchParams.searchField,
            }),
        },
    });
};

export const getInfinitePostsQueryOptions = (params: Omit<GetPostsParams, "page">) => {
    return infiniteQueryOptions({
        queryKey: ["posts", params],
        queryFn: ({ pageParam = 1 }) => getPosts({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const pagination = lastPage.data.pagination[0];
            return pagination.hasNextPage ? pagination.currentPage + 1 : undefined;
        },
        getPreviousPageParam: (firstPage) => {
            const pagination = firstPage.data.pagination[0];
            return pagination.hasPrevPage ? pagination.currentPage - 1 : undefined;
        },
        initialPageParam: 1,
    });
};

export const useInfinitePosts = ({ searchParams, limit }: Omit<GetPostsParams, "page">) => {
    return useInfiniteQuery(getInfinitePostsQueryOptions({ searchParams, limit }));
};
