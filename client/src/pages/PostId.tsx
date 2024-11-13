import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/Loading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment, getAllComments, getPostById, likePost } from "@/helper";
import type { Post } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ArrowLeft, Heart, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PostPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState("");
    const queryClient = useQueryClient();

    const {
        data: post,
        isLoading: postLoading,
        isError: postError,
        error: postErrorData,
    } = useQuery({
        queryKey: ["post", id],
        queryFn: () => getPostById(id as string),
        enabled: !!id,
    });

    const { data: comments, isLoading: commentsLoading } = useQuery({
        queryKey: ["comments", id],
        queryFn: () => getAllComments(id as string),
        enabled: !!id,
    });

    const likeMutation = useMutation({
        mutationFn: () => likePost(id as string),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["post", id] });
            const previousPost = queryClient.getQueryData<Post>(["post", id]);
            if (previousPost) {
                queryClient.setQueryData<Post>(["post", id], (old) => {
                    if (!old) return previousPost;

                    return {
                        post: {
                            ...old.post,
                            likeCount:
                                old.likeStatus === "liked"
                                    ? old.post.likeCount - 1
                                    : old.post.likeCount + 1,
                        },
                        likeStatus: old.likeStatus === "liked" ? "unliked" : "liked",
                    };
                });
            }

            return { previousPost };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousPost) {
                queryClient.setQueryData(["post", id], context.previousPost);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["post", id] });
        },
    });

    const createCommentMutation = useMutation({
        mutationFn: (content: string) => createComment(id as string, content),
        onSuccess: () => {
            setNewComment("");
            queryClient.invalidateQueries({ queryKey: ["comments", id] });
        },
    });

    const handleLikeClick = () => {
        likeMutation.mutate();
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            createCommentMutation.mutate(newComment);
        }
    };

    if (postLoading || commentsLoading) {
        return (
            <div className="flex h-screen justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (postError) {
        return (
            <Layout>
                <div className="container mx-auto px-4 md:px-6 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Error</h1>
                        <p className="text-red-600">{(postErrorData as AxiosError).message}</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!post) {
        return (
            <Layout>
                <div className="container mx-auto px-4 md:px-6 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
                        <p>The requested post could not be found.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 md:px-6 py-8">
                <Button
                    variant="link"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-blue-600 hover:underline mb-4 p-0"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
                </Button>
                <article className="prose lg:prose-xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4">{post.post.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <Avatar>
                            <AvatarFallback className="text-lg font-semibold">
                                {post.post.author.username[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{post.post.author.username}</span>
                        <span>•</span>
                        <time
                            dateTime={new Date(post.post.createdAt).toLocaleString()}
                            className="text-gray-500"
                        >
                            {new Date(post.post.createdAt).toLocaleDateString()}
                        </time>
                    </div>
                    <div
                        dangerouslySetInnerHTML={{ __html: post.post.content }}
                        className="prose lg:prose-lg text-gray-800"
                    />
                </article>

                <div className="mt-8">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={handleLikeClick}
                            disabled={likeMutation.isPending}
                            className={`flex items-center gap-2 ${
                                post.likeStatus === "liked" ? "text-red-500" : "text-gray-600"
                            } transition-colors duration-200`}
                        >
                            <Heart
                                className={`h-5 w-5 ${
                                    post.likeStatus === "liked" ? "fill-current" : ""
                                }`}
                            />
                            <span className="text-sm font-medium">{post.post.likeCount} Likes</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600">
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">{post.post.commentsCount}</span>
                        </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback>
                                        {post.post.author.username[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <Textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="flex-1 min-h-[100px] bg-transparent border-none resize-none focus-visible:ring-0 p-0"
                                />
                            </div>
                            <div className="flex justify-start pl-11">
                                <Button
                                    type="submit"
                                    disabled={createCommentMutation.isPending}
                                    className="bg-gray-900 text-white hover:bg-gray-800"
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    {createCommentMutation.isPending
                                        ? "Posting..."
                                        : "Post Comment"}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-6">
                        {comments?.map((comment) => (
                            <div key={comment._id} className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="text-sm font-semibold">
                                        {comment.author.username[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium">
                                            {comment.author.username}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-800">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
