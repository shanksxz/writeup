import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Posts from "./pages/Posts.jsx";
import { AuthProvider } from "./context/useAuth.jsx";
import MyPosts from "./pages/MyPosts.jsx";
import PostId from "./pages/PostId.jsx";
import { ThemeProvider } from "./context/useTheme.jsx";
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
    element: <Posts />,
  },
  {
    path: "/user/post",
    element: <MyPosts />,
  },
  {
    path: "/post/:id",
    element: <PostId />,
  },
  {
    path : "/profile",
    element: <Profile />
  },
  {
    path: "*",
    element: <h1>Not found</h1>,
  },
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </AuthProvider>,
);
