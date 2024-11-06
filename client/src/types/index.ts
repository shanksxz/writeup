export type Post = {
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
