import { z } from "zod";

export type Post = {
    post: {
        _id: string;
        title: string;
        content: string;
        image: string;
        createdAt: string;
        author: {
            _id: string;
            username: string;
        };
        likes: string[];
        likeCount: number;
        commentsCount: number;
        comments: string[];
    };
    likeStatus: "liked" | "unliked";
};

export type User = {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    createdAt: string;
};

export type BlogCardProps = {
    _id: string;
    title: string;
    content: string;
    image: string;
    createdAt: string;
    author: {
        _id: string;
        username: string;
    };
};

export type PostComments = {
    _id: string;
    content: string;
    createdAt: string;
    likes: string[];
    likeCount: number;
    post: string;
    author: {
        _id: string;
        username: string;
    };
};

export const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export type SignupForm = z.infer<typeof signupSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
