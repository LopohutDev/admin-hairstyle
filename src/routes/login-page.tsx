import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import bgImage from "@/assets/barbershop.jpg";
// import React from "react";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/auth-context";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { isSignedIn, onLogin, loginError } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);
  const [navigateTo, setNavigateTo] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      let timeoutId = setTimeout(() => {
        setNavigateTo(true);
      }, 1000);

      setTimer(timeoutId);
      setOpenSuccessModal(true);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
        setNavigateTo(false);
        setOpenSuccessModal(false);
      }
    };
  }, [isSignedIn]);

  if (navigateTo) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    await onLogin(data);
  };

  return (
    <div
      className="flex items-center justify-center w-screen h-screen bg-[] font-['roboto'] bg-center bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-xl p-5 bg-white rounded-xl">
        <h1 className="text-2xl font-medium">Login</h1>
        {loginError && (
          <p className="font-semibold text-red-500 uppercase">{loginError}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is Required" })}
              className="w-full bg-gray-100 border-gray-300"
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="mt-5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              {...register("password", { required: "Password is Required" })}
              className="w-full bg-gray-100 border-gray-300"
              type="password"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full mt-5">
            Login
          </Button>
        </form>
        <Dialog
          onOpenChange={(o) => setOpenSuccessModal(o)}
          open={openSuccessModal}
          modal
        >
          <DialogContent className="text-gray-100 bg-gray-900 border-gray-900">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-center">
                Successful Login
              </DialogTitle>
              <div className="flex items-center justify-center py-10">
                <div className="flex items-center justify-center p-5 transition-all border-8 border-green-500 rounded-full animate-pop-up">
                  <Check className="w-32 h-32 text-green-500" />
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LoginPage;
