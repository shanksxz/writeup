import Login from "@/app/routes/auth/login";
import Register from "@/app/routes/auth/register";
import Post from "@/app/routes/posts/post";
import Posts from "@/app/routes/posts/posts";
import { paths } from "@/config/paths";
import Protected from "@/features/auth/components/protected";
import VerifyEmail from "@/features/email/components/email-verify";
import Profile from "@/features/user/components/user-profile";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Landing from "./routes/landing";
import NotFoundRoute from "./routes/not-found";
import { EmailVerificationBanner } from "@/features/email/components/email-banner";
import CreatePost from "./routes/posts/create-post";
import MyPosts from "./routes/posts/user-post";

export const router = createBrowserRouter([
    {
        path: paths.home.path,
        element: <Landing />,
    },
    {
        path: paths.auth.login.path,
        element: <Login />,
    },
    {
        path: paths.auth.register.path,
        element: <Register />,
    },
    {
        path: paths.post.create.path,
        element: (
            <Protected requireVerified>
                <CreatePost />
            </Protected>
        ),
    },
    {
        path: paths.user.posts.path,
        element: (
            <Protected requireVerified>
                <MyPosts />
            </Protected>
        ),
    },
    {
        path: paths.post.detail.path,
        element: (
            <Protected>
                <Post />
            </Protected>
        ),
    },
    {
        path: paths.user.profile.path,
        element: (
            <Protected>
                <Profile />
            </Protected>
        ),
    },
    {
        path: paths.post.list.path,
        element: <Posts />,
    },
    {
        path: paths.email.verify.path,
        element: <VerifyEmail />,
    },
    {
        path: paths.email.verify_banner.path,
        element: <EmailVerificationBanner />,
    },
    {
        path: paths.notFound.path,
        element: <NotFoundRoute />,
    },
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
