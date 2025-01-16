export const paths = {
    home: {
        path: "/",
        getHref: () => "/",
    },
    auth: {
        register: {
            path: "/auth/register",
            getHref: (redirectTo?: string | null | undefined) =>
                `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
        },
        login: {
            path: "/auth/login",
            getHref: (redirectTo?: string | null | undefined) =>
                `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
        },
    },
    post: {
        create: {
            path: "/create/post",
            getHref: () => "/create/post",
        },
        list: {
            path: "/posts",
            getHref: () => "/posts",
        },
        detail: {
            path: "/post/:id",
            getHref: (id: string) => `/post/${id}`,
        },
    },
    user: {
        posts: {
            path: "/user/post",
            getHref: () => "/user/post",
        },
        profile: {
            path: "/profile",
            getHref: () => "/profile",
        },
    },
    email: {
        verify: {
            path: "/verify-email/:token",
            getHref: (token: string) => `/verify-email/${token}`,
        },
        verify_banner: {
            path: "/verify-email",
            getHref: () => "/verify-email",
        }
    },
    notFound: {
        path: "*",
        getHref: () => "/404",
    },
} as const;
