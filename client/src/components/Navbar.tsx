import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/context/useAuth";
import axios from "axios";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ModeToggle from "./ModeToggle";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_API_URL}/auth/signout`, {
                withCredentials: true,
            });
            toast.success("Logged out successfully");
            setUser(null);
            navigate("/auth/login");
        } catch (_error) {
            toast.error("Failed to log out");
        }
    };

    const NavLinks = () => (
        <>
            <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Home
            </Link>
            <Link
                to="/user/post"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
                My Posts
            </Link>
            <Link
                to="/create/post"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
                Create Post
            </Link>
        </>
    );

    return (
        <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-5 md:px-0 flex justify-between w-full h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link to="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold text-lg">WriteUp</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <NavLinks />
                    </nav>
                </div>
                <Button
                    variant="ghost"
                    className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden"
                    onClick={() => setIsOpen(true)}
                >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                </Button>
                <div className="flex items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center space-x-2">
                        <ModeToggle />
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="h-8 w-8 cursor-pointer">
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {user?.firstName?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                className="h-8 rounded-full"
                                onClick={() => navigate("/auth/login")}
                            >
                                Sign In
                            </Button>
                        )}
                    </nav>
                </div>
            </div>
            {isMobile && (
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <nav className="flex flex-col gap-4">
                            <Link
                                to="/"
                                className="flex items-center"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="font-bold text-lg">WriteUp</span>
                            </Link>
                            <NavLinks />
                            {user ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                                        Profile
                                    </Link>
                                    <Button variant="ghost" onClick={handleLogout}>
                                        Log out
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => {
                                        navigate("/auth/login");
                                        setIsOpen(false);
                                    }}
                                >
                                    Sign In
                                </Button>
                            )}
                        </nav>
                    </SheetContent>
                </Sheet>
            )}
        </header>
    );
}
