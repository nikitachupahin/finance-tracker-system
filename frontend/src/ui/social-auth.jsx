import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa"; // ✅ GitHub logo
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../libs/apiCall";
import { auth } from "../../libs/firebaseConfig";
import useStore from "@/store";
import { Button } from "@/ui/buttons.tsx";

export const SocialAuth = ({ isLoading, setLoading }) => {
  const [user] = useAuthState(auth);
  const [selectedProvider, setSelectedProvider] = useState("google");
  const { setCredentials } = useStore((state) => state);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setSelectedProvider("google");
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    setSelectedProvider("github");
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with GitHub", error);
    }
  };

  useEffect(() => {
    const saveUserToDb = async () => {
      try {
        const userData = {
          name: user.displayName,
          email: user.email,
          provider: selectedProvider,
          uid: user.uid,
        };

        setLoading(true);
        const { data: res } = await api.post("/auth/sign-up", userData);
        console.log(res);

        if (res?.user) {
          toast.success(res?.message);
          const userInfo = { ...res.user, token: res?.token };
          localStorage.setItem("user", JSON.stringify(userInfo));
          setCredentials(userInfo);

          setTimeout(() => {
            navigate("/overview");
          }, 1500);
        }
      } catch (error) {
        console.error("Something went wrong:", error);
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      saveUserToDb();
    }
  }, [user?.uid]);

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={signInWithGoogle}
        disabled={isLoading}
        variant="outline"
        className="w-full flex items-center justify-center gap-2 text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
        type="button"
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </Button>

      <Button
        onClick={signInWithGithub}
        disabled={isLoading}
        variant="outline"
        type="button"
        className="w-full flex items-center justify-center gap-2 text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
      >
        <FaGithub className="text-xl" />
        GitHub
      </Button>
    </div>
  );
};
