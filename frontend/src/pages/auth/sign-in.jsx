import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/card";
import Input from "@/components/input";
import { Button } from "@/components/buttons";
import useStore from "@/store";
import api from "../../libs/apiCall";
import {toast} from "sonner"

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const SignIn = () => {
  const { user, setCredentails} = useStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signinSchema),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState();

  useEffect(() => {
    user && navigate("/");
  }, [user]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const { data: res }  = await api.post("/auth/sign-in", data);
      if (res?.user) {
        toast.success(res?.message); 

        const userInfo = {...res?.user, token: res.token};
        localStorage.setItem("user", JSON.stringify(userInfo));

        setCredentails(userInfo);

        setTimeout(() => {
          navigate("/overview");
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading (false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6 bg-white dark:bg-black/20 shadow-md rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold mb-4 dark:text-white">
            Sign In
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                id="email"
                label="Email"
                placeholder="you@example.com"
                type="email"
                {...register("email")}
                error={errors.email?.message}
                disabled={loading}
                className="border dark:border-gray-700"
              />
            </div>
            <div>
              <Input
                id="password"
                label="Password"
                placeholder="Your password"
                type="password"
                {...register("password")}
                error={errors.password?.message}
                disabled={loading}
                className="border dark:border-gray-700"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center gap-2">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <Link
            to="/sign-up"
            className="text-sm font-semibold text-violet-600 hover:underline"
          >
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;

