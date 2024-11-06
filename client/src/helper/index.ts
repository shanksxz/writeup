import { Post } from "@/types";
import axios from "axios";

const url = import.meta.env.VITE_API_URL;

type PostResponse = {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export async function getPosts(
  page: number,
  limit: number,
): Promise<PostResponse> {
  const res = await axios.get(`${url}/post`, {
    params: { page, limit },
    withCredentials: true,
  });
  return res.data;
}

export async function getCurrentUserPosts(
  page: number,
  limit: number,
): Promise<PostResponse> {
  const res = await axios.get(`${url}/user/posts`, {
    params: { page, limit },
    withCredentials: true,
  });
  return res.data;
}

export async function getPostById(id: string): Promise<Post> {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/post/${id}`,
    {
      withCredentials: true,
    },
  );
  return res.data;
}

