import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useAuth } from '@/context/useAuth';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });


  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if(user) {
      navigate('/');
    }
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      console.log(import.meta.env.VITE_API_URL);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signin`, data, {
        withCredentials: true,
      });
      setUser(res.data.user)
      toast.success("Login successful, redirecting.....");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="h-screen flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <span className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </span>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              <Link to="/auth/signup">
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </section>
  );
}
