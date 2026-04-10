import { useState } from "react";
import ModeToggle from "@/components/common/mode-toggle";
import { INITIAL_LOGIN_FORM } from "@/constants/auth-constant";
import { loginSchema, type LoginForm } from "@/validations/auth-validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import supabase from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setServerError(null);

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

    if (authError) {
      setServerError(authError.message);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      setServerError("Failed to fetch profile");
      setLoading(false);
      return;
    }

    if (profile.role === "admin") {
      navigate("/admin");
    } else if (profile.role === "cashier") {
      navigate("/order");
    } else {
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <div className="bg-background text-foreground w-full h-screen flex flex-col transition-colors duration-300">
      <div className="flex justify-end p-4">
        <ModeToggle />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to kasirKU
        </h1>
        <div className="flex flex-col w-[320px] items-center gap-4 border border-border bg-muted/50 p-8 rounded-2xl shadow-sm backdrop-blur-sm">
          <div className="w-full space-y-1">
            <p className="text-sm text-center text-muted-foreground mb-4">
              Login to your account
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium opacity-70">Email</label>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium opacity-70">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="********"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {serverError && (
                <p className="text-xs text-red-500 text-center">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
