import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/Loading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types";
import axios, { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function PostId() {
    const { id } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/post/${id}`, {
                    withCredentials: true,
                });
                setPost(response.data.post);
            } catch (err) {
                if (err instanceof AxiosError) {
                    if (err.response?.status === 404) {
                        setError("Post not found");
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-screen justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }
    if (error) {
        return (
            <Layout>
                <div className="container mx-auto px-4 md:px-6 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Error</h1>
                        <p className="text-red-600">{error}</p>
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
                {post && (
                    <article className="prose lg:prose-xl mx-auto">
                        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                            <Avatar>
                                <AvatarFallback className="text-lg font-semibold">
                                    {post.author.username[0]}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{post.author.username}</span>
                            <span>•</span>
                            <time
                                dateTime={new Date(post.createdAt).toLocaleString()}
                                className="text-gray-500"
                            >
                                {new Date(post.createdAt).toDateString()}
                            </time>
                        </div>
                        <div
                            dangerouslySetInnerHTML={{ __html: post.content }}
                            className="prose lg:prose-lg text-gray-800"
                        />
                    </article>
                )}
            </div>
        </Layout>
    );
}
