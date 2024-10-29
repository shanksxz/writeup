import { Toaster } from "sonner";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="mx-auto max-w-4xl">
      <Navbar />
      {children}
      <Toaster />
    </div>
  );
};
