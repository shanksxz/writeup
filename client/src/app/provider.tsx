import { AuthProvider } from "@/context/use-auth";
import { ThemeProvider } from "@/context/use-theme";
import { queryConfig } from "@/lib/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
    defaultOptions: queryConfig,
});

export const AppProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider>
                    <Toaster />
                    {import.meta.env.DEV && <ReactQueryDevtools />}
                    {children}
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};
