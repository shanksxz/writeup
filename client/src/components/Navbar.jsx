import React from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { Link } from "react-router-dom";
import ModeToggle from "./ToggleMode";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { toast } from "sonner";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/auth/signout`, {
        withCredentials: true,
      });
      toast.success("Logged out successfully");
      setUser(null);
      navigate("/auth/login");
    } catch (error) {
      toast.error("Failed to log out");
      console.error("Failed to log out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 justify-between w-full items-center">
        <Link to="/" className="flex items-center space-x-6">
          <span className="font-bold text-lg">WriteUp</span>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
            <Link to="/user/post" className="transition-colors hover:text-foreground/80 text-foreground/60">My Posts</Link>
            <Link to="/create/post" className="transition-colors hover:text-foreground/80 text-foreground/60">Create Post</Link>
          </nav>
        </Link>
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-2">
            <ModeToggle />
            {user
              ? (<DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.firstName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>)
              : (<Button className="h-8 rounded-full" onClick={() => navigate("/auth/login")}>Sign In</Button>)
            }
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs pr-0">
              <div className="grid gap-4 py-4">
                <div className="px-2 py-1">
                  <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Menu</h2>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/")}>Home</Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/user/post")}>My Posts</Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/create/post")}>Create Post</Button>
                  </div>
                </div>
                <div className="px-2 py-1">
                  <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Account</h2>
                  <div className="space-y-1">
                    {user ? (
                      <>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/profile")}>Profile</Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>Log out</Button>
                      </>
                    ) : (
                      <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/auth/login")}>Sign In</Button>
                    )}
                  </div>
                </div>
                <div className="px-2 py-1">
                  <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Theme</h2>
                  <div className="space-y-1">
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}