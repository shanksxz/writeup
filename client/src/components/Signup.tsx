import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    });

    const navigate = useNavigate();

    const onSubmit = async (data: SignupForm) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, data);
            toast.success("Account created successfully, redirecting.....");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            navigate("/auth/login");
        } catch (_error) {
            toast.error("An error occurred, please try again");
        }
    };

    return (
        <section className="h-screen flex justify-center items-center">
            <Card className="mx-auto max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle className="text-xl">Sign Up</CardTitle>
                        <CardDescription>
                            Enter your information to create an account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input
                                        id="first-name"
                                        placeholder="Max"
                                        {...register("firstName")}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-sm">
                                            {errors.firstName.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input
                                        id="last-name"
                                        placeholder="Robinson"
                                        {...register("lastName")}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-sm">
                                            {errors.lastName.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    placeholder="maxrobinson"
                                    {...register("username")}
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" {...register("password")} />
                                {errors.password && (
                                    <p className="text-red-500 text-sm">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <Button type="submit" className="w-full">
                                Create an account
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link to={"/auth/login"} className="underline">
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </section>
    );
}
