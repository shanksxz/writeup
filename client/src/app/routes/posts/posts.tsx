import Layout from "@/components/Layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInfinitePosts } from "@/features/posts/api/get-posts";
import PostCard from "@/features/posts/components/post-card";
import { PostSearch } from "@/features/posts/components/post-search";
import { POSTS_PER_PAGE } from "@/helper/index";
import type { Post, SearchParams } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export default function Posts() {
    const [searchParams, setSearchParams] = useSearchParams();

    const searchFilters = {
        search: searchParams.get("search") || "",
        searchField: searchParams.get("searchField") || "title",
    };

    const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfinitePosts({
        searchParams: searchFilters,
        limit: POSTS_PER_PAGE,
    });

    const handleSearch = (filters: SearchParams) => {
        const newParams = new URLSearchParams();
        if (filters.search) newParams.set("search", filters.search);
        if (filters.searchField) newParams.set("searchField", filters.searchField);
        setSearchParams(newParams);
    };

    const allPosts = data?.pages.flatMap((page) => page.data.posts) ?? [];
    const hasNoPosts = !isLoading && !isError && allPosts.length === 0;
    const showPosts = !isLoading && !isError && allPosts.length > 0;
    const loadingRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });

        if (loadingRef.current) {
            observer.observe(loadingRef.current);
        }

        return () => {
            if (loadingRef.current) {
                observer.unobserve(loadingRef.current);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <Layout>
            <div className="flex flex-col min-h-screen space-y-8 py-8">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Search Posts</h2>
                    <p className="text-muted-foreground">
                        Find the content you're looking for using our advanced search.
                    </p>
                </div>

                <PostSearch
                    initialFilters={{
                        search: searchFilters.search,
                        searchField: searchFilters.searchField,
                    }}
                    onSearch={handleSearch}
                />

                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                )}

                {isError && (
                    <div className="text-red-500 text-center my-8 p-4 bg-red-100/10 rounded-lg border border-red-500/20">
                        <p className="text-lg font-semibold">Oops! Something went wrong.</p>
                        <p className="text-sm mt-2">
                            {error instanceof Error ? error.message : "Failed to fetch posts"}
                        </p>
                    </div>
                )}

                {hasNoPosts && (
                    <Alert className="max-w-2xl mx-auto">
                        <AlertDescription>No posts found. Check back later for new content!</AlertDescription>
                    </Alert>
                )}

                {showPosts && (
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">All Posts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {allPosts.map((post: Post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Loading indicator for infinite scroll */}
                {hasNextPage && (
                    <div ref={loadingRef} className="flex justify-center py-4">
                        {isFetchingNextPage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    </div>
                )}
            </div>
        </Layout>
    );
}
