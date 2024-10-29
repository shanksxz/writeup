import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/Loading";

export default function PostId() {
  const { id } = useParams(); 
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/post/${id}`,
          {
            withCredentials: true,
          },
        );
        console.log(response.data.post);
        setPost(response.data.post);
      } catch (err) {
        setError(err.message);
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
  };
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Button
          variant="text"
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
              <time dateTime={new Date(post.createdAt).toLocaleString()} className="text-gray-500">
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

