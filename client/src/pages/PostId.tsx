import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/Loading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getPostById } from '@/helper';
import { ArrowLeft } from 'lucide-react';

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id as string),
  });

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Error</h1>
            <p className="text-red-600">{(error as AxiosError).message}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!data) {
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
          <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <Avatar>
              <AvatarFallback className="text-lg font-semibold">
                {data.author.username[0]}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{data.author.username}</span>
            <span>•</span>
            <time dateTime={new Date(data.createdAt).toLocaleString()} className="text-gray-500">
              {new Date(data.createdAt).toLocaleDateString()}
            </time>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: data.content }}
            className="prose lg:prose-lg text-gray-800"
          />
        </article>
      </div>
    </Layout>
  );
};

export default PostPage;