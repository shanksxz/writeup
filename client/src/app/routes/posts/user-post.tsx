
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/ui/spinner";
import Tiptap from "@/features/editor/tip-tap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useInfiniteUserPosts } from "@/features/user/api/get-posts";
import { useDeletePost } from "@/features/user/api/delete-post";
import { useUpdatePost } from "@/features/user/api/edit-post";
import { POSTS_PER_PAGE_MY_POSTS } from "@/helper";
import { paths } from "@/config/paths";
import type { Post } from "@/types";
import { stripHtmlAndTruncate } from "@/utils";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function MyPosts() {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string>();
    const [postToEdit, setPostToEdit] = useState<Post | null>();

    const {
        data,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch
    } = useInfiniteUserPosts({
        limit: POSTS_PER_PAGE_MY_POSTS
    });

    const { mutate: deletePost, isPending: isDeleting } = useDeletePost({
        onSuccess: () => {
            toast.success("Post deleted successfully");
            setIsDeleteDialogOpen(false);
            setPostToDelete(undefined);
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const { mutate: updatePost, isPending: isUpdating } = useUpdatePost({
        onSuccess: () => {
            toast.success("Post updated successfully");
            setIsEditDialogOpen(false);
            setPostToEdit(null);
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            title: "",
            content: "",
        }
    });

    const handleEditPost = (post: Post) => {
        setPostToEdit(post);
        reset({ title: post.title, content: post.content });
        setIsEditDialogOpen(true);
    };

    const onSubmit = handleSubmit((data) => {
        if (postToEdit) {
            updatePost({ postId: postToEdit._id, ...data });
        }
    });

    const allPosts = data?.pages.flatMap(page => page.data.posts) ?? [];
    const showPosts = !isLoading && allPosts.length > 0;
    const hasNoPosts = !isLoading && allPosts.length === 0;

    if (isLoading) return <LoadingSpinner />;

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">My Posts</h1>
                    <Button asChild>
                        <Link to={paths.post.create.getHref()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Post
                        </Link>
                    </Button>
                </div>

                {hasNoPosts && (
                    <p className="text-center text-muted-foreground">No posts found</p>
                )}

                {showPosts && (
                    <div className="grid gap-4">
                        {allPosts.map((post) => (
                            <Card key={post._id}>
                                <CardHeader>
                                    <CardTitle>{post.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{stripHtmlAndTruncate(post.content)}</p>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" onClick={() => handleEditPost(post)}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setPostToDelete(post._id);
                                            setIsDeleteDialogOpen(true);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {hasNextPage && (
                    <div className="flex justify-center mt-4">
                        <Button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                'Load More'
                            )}
                        </Button>
                    </div>
                )}

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Post</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this post? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => postToDelete && deletePost(postToDelete)}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Edit Post</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={onSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Controller
                                        name="title"
                                        control={control}
                                        render={({ field }) => (
                                            <Input id="title" {...field} />
                                        )}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="content">Content</Label>
                                    <Controller
                                        name="content"
                                        control={control}
                                        render={({ field }) => (
                                            <Tiptap
                                                content={field.value}
                                                onChange={field.onChange}
                                                className="h-[40vh] md:h-[50vh] w-full"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
}