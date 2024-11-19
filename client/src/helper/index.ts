import type { LoginForm, Post, PostComments, SignupForm } from "@/types";
import axios from "axios";

type PostResponse = {
    posts: Post["post"][];
    totalPages: number;
    currentPage: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

export const url = import.meta.env.VITE_API_URL;
export const POSTS_PER_PAGE = 6;

export async function getPosts(page: number, limit: number): Promise<PostResponse> {
    const res = await axios.get(`${url}/post`, {
        params: { page, limit },
        withCredentials: true,
    });
    return res.data;
}

export async function getCurrentUserPosts(page: number, limit: number): Promise<PostResponse> {
    const res = await axios.get(`${url}/user/posts`, {
        params: { page, limit },
        withCredentials: true,
    });
    return res.data;
}

export async function getPostById(id: string): Promise<Post & { likeStatus: "unliked" | "liked" }> {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/post/${id}`, {
        withCredentials: true,
    });
    return res.data;
}

// not used
export async function deletePost(id: string): Promise<void> {
    await axios.delete(`${import.meta.env.VITE_API_URL}/post/${id}`, {
        withCredentials: true,
    });
}

export async function updatePost(id: string, title: string, content: string): Promise<Post> {
    const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/post/${id}`,
        {
            title,
            content,
        },
        {
            withCredentials: true,
        },
    );
    return res.data;
}

export async function createComment(postId: string, content: string): Promise<PostComments> {
    const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/${postId}/comment`,
        { content },
        {
            withCredentials: true,
        },
    );
    return res.data.post;
}

export async function getAllComments(postId: string): Promise<PostComments[]> {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/${postId}/comment`, {
        withCredentials: true,
    });
    return res.data.comments;
}

export async function likePost(postId: string): Promise<
    Post & {
        likeStatus: "liked" | "unliked";
    }
> {
    const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${postId}/like`,
        {},
        {
            withCredentials: true,
        },
    );
    return res.data;
}

export async function loginUser(data: LoginForm) {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signin`, data, {
        withCredentials: true,
    });
    return response.data;
}

export async function signUpUser(data: SignupForm) {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, data);
    return response.data;
}
