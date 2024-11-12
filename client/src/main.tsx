import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/Login.jsx";
import Protected from "./components/Protected.js";
import Signup from "./components/Signup.jsx";
import { AuthProvider } from "./context/useAuth.jsx";
import { ThemeProvider } from "./context/useTheme.jsx";
import MyPosts from "./pages/MyPosts.jsx";
import PostId from "./pages/PostId.jsx";
import Posts from "./pages/Posts.jsx";
import Profile from "./pages/Profile.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/auth/login",
        element: <Login />,
    },
    {
        path: "/auth/signup",
        element: <Signup />,
    },
    {
        path: "/create/post",
        element: (
            <Protected fallBack={<Login />}>
                <Posts />
            </Protected>
        ),
    },
    {
        path: "/user/post",
        element: (
            <Protected fallBack={<Login />}>
                <MyPosts />
            </Protected>
        ),
    },
    {
        path: "/post/:id",
        element: (
            <Protected fallBack={<Login />}>
                <PostId />
            </Protected>
        ),
    },
    {
        path: "/profile",
        element: (
            <Protected fallBack={<Login />}>
                <Profile />
            </Protected>
        ),
    },
    {
        path: "*",
        element: <h1>Not found</h1>,
    },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <ThemeProvider>
                <RouterProvider router={router} />
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
            </ThemeProvider>
        </AuthProvider>
    </QueryClientProvider>,
);
