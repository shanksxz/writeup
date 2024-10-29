import { Link } from "react-router-dom";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, UserIcon } from "lucide-react";

export default function BlogCard({ post }) {
  return (
    <Card className="overflow-hidden max-w-sm rounded-sm">
      {post.image && (
        <img
          src={post.image}
          alt=""
          width={400}
          height={250}
          className="w-full h-40 object-cover"
        />
      )}
      <CardHeader className="px-4 py-2">
        <div className="flex items-center space-x-3 text-xs text-muted-foreground mb-1">
          <div className="flex items-center">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toDateString()}
            </time>
          </div>
          {post.author && (
            <div className="flex items-center">
              <UserIcon className="mr-1 h-3 w-3" />
              <span>{post.author.username}</span>
            </div>
          )}
        </div>
        <CardTitle className="text-base">
          <Link to={`/post/${post._id}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      {post.author && (
        <CardFooter className="px-4 py-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-6 w-6">
              <AvatarFallback>
                {post.author.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium">{post.author.username}</p>
              <p className="text-[10px] text-muted-foreground">Author</p>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
// <CardContent className="px-4 py-2">
//   <div
//     className="line-clamp-1 text-xs text-muted-foreground"
//     dangerouslySetInnerHTML={{ __html: post.content }}
//   />
// </CardContent>
