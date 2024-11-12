import { useAuth } from "@/context/useAuth";

export default function Protected({
    children,
    fallBack,
}: {
    children: React.ReactNode;
    fallBack: React.ReactNode;
}) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) return fallBack;

    return children;
}
