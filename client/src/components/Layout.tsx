import { Toaster } from "sonner";
import Navbar from "./Navbar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen max-w-6xl mx-auto flex flex-col">
            <Navbar />
            <main className="flex-grow px-4 sm:px-6 lg:px-8">{children}</main>
            <footer className="bg-white dark:bg-gray-800 border-t py-4 mt-8">
                <div className="container mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
                    © {new Date().getFullYear()} WriteUp. All rights reserved.
                </div>
            </footer>
            <Toaster />
        </div>
    );
}
