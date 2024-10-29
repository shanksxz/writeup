import { Toaster } from "sonner";
import { useAuth } from "./context/useAuth";
import Home from "./pages/Home";
import { useNavigate } from "react-router-dom";

export default function App() {

  const { user } = useAuth();
  const navigate = useNavigate();

  if(!user) {
    navigate("/auth/login");
  }
  
  return (
    <>
      <Home />
      <Toaster />
    </>
  );
}
