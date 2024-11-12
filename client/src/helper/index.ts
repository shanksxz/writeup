import type { Post } from "@/types";
import axios from "axios";

type PostResponse = {
    posts: Post[];
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

export async function getPostById(id: string): Promise<Post> {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/post/${id}`, {
        withCredentials: true,
    });
    return res.data.post;
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
