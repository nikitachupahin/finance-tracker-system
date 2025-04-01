import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import Input from "@/ui/input";
import { Button } from "@/ui/buttons";
import useStore from "@/store";
import { SocialAuth } from "@/ui/social-auth";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

const SignUp = () => {
  const { user } = useStore((state) => state);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const onSubmit = async (data) => {
    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6 bg-white dark:bg-black/20 shadow-md rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold mb-4 dark:text-white">
            Create Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <SocialAuth isLoading={loading} setLoading={setLoading} />
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center mb-6">
            <span className="border-t w-1/4 border-gray-300"></span>
            <span className="px-2 text-sm text-gray-500">OR</span>
            <span className="border-t w-1/4 border-gray-300"></span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                id="name"
                placeholder="John Smith"
                {...register("name")}
                error={errors.name?.message}
                disabled={loading}
              />
            </div>
            <div>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                {...register("email")}
                error={errors.email?.message}
                disabled={loading}
              />
            </div>
            <div>
              <Input
                id="password"
                placeholder="Your password"
                type="password"
                {...register("password")}
                error={errors.password?.message}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
