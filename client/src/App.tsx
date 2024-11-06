import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "./context/useAuth";
import Home from "./pages/Home";

export default function App() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/auth/login");
        }
    }, [user, navigate]);

    return (
        <>
            <Home />
            <Toaster />
        </>
    );
}
