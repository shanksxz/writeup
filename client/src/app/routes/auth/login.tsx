import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { paths } from "@/config/paths";
import { useAuth } from "@/context/use-auth";
import { loginUser } from "@/helper";
import { type LoginForm, loginSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, setUser } = useAuth();
    const redirectTo = searchParams.get("redirectTo") || paths.home.path;

    useEffect(() => {
        if (user) {
            navigate(redirectTo, { replace: true });
        }
    }, [user, navigate, redirectTo]);

    const { mutate, isPending } = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setUser(data.user);
            toast.success("Login successful, redirecting...");
            setTimeout(() => {
                navigate(redirectTo, { replace: true });
            }, 2000);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return (
        <section className="h-screen flex justify-center items-center">
            <Card className="mx-auto max-w-sm">
                <form onSubmit={handleSubmit((data) => mutate(data))}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>Enter your email below to login to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link 
                                        to={paths.auth.register.getHref(redirectTo)}
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input id="password" type="password" {...register("password")} />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Logging in..." : "Login"}
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            <Link to={paths.auth.register.getHref(redirectTo)}>
                                Don&apos;t have an account? Sign up
                            </Link>
                        </div>
                    </CardContent>
                </form>
            </Card>
            <Toaster />
        </section>
    );
}
