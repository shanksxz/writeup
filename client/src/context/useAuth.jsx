import LoadingSpinner from "@/components/Loading";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        withCredentials: true,
      });

      if (res.data) {
        setUser(res.data.user);
      }
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, isAuthenticated: !!user, setUser }}>
      {loading ? (
        <div className="flex h-screen justify-center items-center">
          <LoadingSpinner className={""} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
