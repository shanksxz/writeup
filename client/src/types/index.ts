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
