"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { signIn, SignInResponse } from "next-auth/react";
import { useForm } from "react-hook-form";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  type FormData = {
    email: string;
    password: string;
  };
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (isLoading) return;
    setIsLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res && res.ok) {
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    }
    if (res && !res.ok) {
      toast.error("Invalid credentials");
    }

    setIsLoading(false);
  };

  return (
    <section className="bg-linear-to-b from-muted to-background flex min-h-screen px-4 py-16 md:py-32 justify-center items-center ">
      <div>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="max-w-92 m-auto h-fit w-full ">
              <div className="p-6">
                <div>
                  <img
                    src="/logo/logo-light.svg"
                    className="w-12 mix-blend-difference"
                  />
                  <h1 className="mt-6 text-balance text-xl font-semibold">
                    <span className="text-muted-foreground">
                      Welcome back to Arc Labs!
                    </span>{" "}
                    Sign in to continue
                  </h1>
                </div>
                <div className="mt-6 space-y-2">
                  <Button
                    onClick={() =>
                      signIn("google", {
                        redirect: true,
                        callbackUrl: "/dashboard",
                      })
                    }
                    className=" w-full flex cursor-pointer"
                  >
                    <IconBrandGoogleFilled /> Google
                  </Button>
                </div>
                <div className="flex mb-5 mt-6 items-center justify-center gap-4">
                  <hr className="flex-grow border-t    border-dashed " />
                  <span className="text-muted-foreground">
                    or continue with
                  </span>
                  <hr className="flex-grow border-t  border-dashed " />
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  action=""
                  className="max-w-92 m-auto h-fit w-full "
                >
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Input
                        type="email"
                        required
                        id="email"
                        placeholder="Your email"
                        {...register("email", { required: false })}
                        className={`ring-foreground/15 border-transparent ring-1 `}
                      />

                      <Input
                        type="password"
                        required
                        id="password"
                        placeholder="Your password"
                        className={`
                      
                       ring-foreground/15 border-transparent ring-1 `}
                        {...register("password", { required: true })}
                      />
                    </div>

                    <Button className="w-full cursor-pointer" size="default">
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="px-6 mb-5">
                <p className="text-muted-foreground text-sm">
                  Don't have an account ?
                  <Button asChild variant="link" className="px-2">
                    <Link href="/auth/sign-up">Create account</Link>
                  </Button>
                </p>
              </div>
            </div>
            <div className="bg-muted relative hidden md:block">
              <img
                src="https://i.pinimg.com/736x/a7/70/cd/a770cd33fdd08ed309fb2ecf3a0af6d3.jpg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground mt-5 *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </section>
  );
}
