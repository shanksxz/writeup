import BlogCard from "@/components/BlogCard";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { POSTS_PER_PAGE, getPosts } from "@/helper";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["posts", currentPage],
        queryFn: () => getPosts(currentPage, POSTS_PER_PAGE),
    });

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= (data?.totalPages ?? 0)) {
            setCurrentPage(newPage);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col min-h-screen">
                <div className="flex-grow">
                    {isLoading && (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    )}
                    {isError && (
                        <div className="text-red-500 text-center my-4">
                            {error instanceof Error ? error.message : "Failed to fetch posts"}
                        </div>
                    )}
                    {!isLoading && !isError && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 px-4 md:px-6 mt-5 mb-3">
                            {data?.posts.map((post) => (
                                <BlogCard key={post._id} post={post} />
                            ))}
                        </div>
                    )}
                </div>
                {!isLoading && !isError && data?.totalPages && data?.totalPages > 1 && (
                    <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t py-4">
                        <div className="container flex justify-center items-center space-x-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous page</span>
                            </Button>
                            <div className="text-sm font-medium">
                                Page {currentPage} of {data.totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === data.totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Next page</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
