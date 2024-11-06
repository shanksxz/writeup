import Layout from "@/components/Layout";
import Tiptap from "@/components/TipTap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Post } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { type AxiosError } from "axios";
import type React from "react";
import { useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";

const postSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
    content: z.string().min(10, "Content must be at least 10 characters long"),
    category: z.enum(["technology", "lifestyle", "travel", "food"]),
    image: z
        .instanceof(File)
        .refine((file) => file.size <= 5000000, "File size should be less than 5MB")
        .refine(
            (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported.",
        )
        .optional(),
});

type PostForm = z.infer<typeof postSchema>;

export default function CreatePost(): React.ReactElement {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
    } = useForm<PostForm>({
        resolver: zodResolver(postSchema),
    });

    // @ts-ignore
    const watchImage = watch("image") as FileList;

    useEffect(() => {
        if (watchImage && watchImage.length > 0) {
            const file = watchImage[0];
            const fileReader = new FileReader();
            fileReader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    setPreviewUrl(e.target.result as string);
                }
            };
            fileReader.readAsDataURL(file);
        }
    }, [watchImage]);

    const { mutate, status } = useMutation({
        mutationFn: async (data: PostForm) => {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("content", data.content);
            formData.append("category", data.category);
            if (data.image) {
                formData.append("image", data.image);
            }

            const response = await axios.post<Post>(`${import.meta.env.VITE_API_URL}/post/create`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success("Post created successfully, redirecting.....");
            setTimeout(() => {
                navigate("/");
            }, 2000);
        },
        onError: (error: unknown) => {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error(axiosError.response?.data?.message || "Error creating post");
            } else {
                toast.error("An unexpected error occurred");
            }
        },
    });

    const onSubmit: SubmitHandler<PostForm> = (data) => {
        mutate(data);
    };

    return (
        <Layout>
            <div className="px-4 md:px-6 max-w-2xl mt-2">
                <h1 className="text-2xl font-bold mb-4">Create New Blog Post</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register("title")} placeholder="Enter post title" />
                        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="content">Content</Label>
                        <Controller
                            name="content"
                            control={control}
                            render={({ field }) => (
                                <Tiptap content={field.value} onChange={field.onChange} />
                            )}
                        />
                        {errors.content && <p className="text-red-500">{errors.content.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="technology">Technology</SelectItem>
                                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                                        <SelectItem value="travel">Travel</SelectItem>
                                        <SelectItem value="food">Food</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.category && (
                            <p className="text-red-500">{errors.category.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="image">Cover Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            {...register("image")}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    register("image").onChange(e);
                                }
                            }}
                        />
                        {errors.image && <p className="text-red-500">{errors.image.message}</p>}
                        {previewUrl && (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="mt-2 max-w-full h-auto"
                            />
                        )}
                    </div>
                    <Button type="submit" disabled={status === "pending"} className="w-full">
                        {status === "pending" ? "Publishing..." : "Publish Post"}
                    </Button>
                </form>
            </div>
        </Layout>
    );
}
