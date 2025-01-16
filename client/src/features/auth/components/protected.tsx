import { paths } from "@/config/paths";
import { useAuth } from "@/context/use-auth";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedProps {
    children: React.ReactNode;
    requireVerified?: boolean;
}

export default function Protected({ children, requireVerified = false }: ProtectedProps) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if(!isAuthenticated) {
        return (
            <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
        )
    }

    if(requireVerified && !user?.isEmailVerified) {
        return (
            <Navigate to={paths.email.verify_banner.getHref()} replace />
        )
    }

    return children;
}
