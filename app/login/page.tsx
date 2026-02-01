"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/lib/hooks";
import { Header } from "../components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ApiError } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const login = useLogin();
  const error = login.error as ApiError | null;
  const fieldErrors = error?.details ?? {};

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  function onSubmit(data: LoginFormData) {
    login.mutate(data);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 pt-16">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >
          <Card>
            <CardHeader>
              <CardTitle>Log in</CardTitle>
              <CardDescription>
                Welcome back. Sign in to access your city marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.06,
                      delayChildren: 0.2,
                    },
                  },
                }}
              >
                {error && (
                  <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    <Alert variant="destructive">
                      <AlertDescription>{error.error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <motion.div className="space-y-2" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...form.register("email")}
                  />
                  {(form.formState.errors.email || fieldErrors.email) && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email?.message ??
                        fieldErrors.email?.[0]}
                    </p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...form.register("password")}
                  />
                  {(form.formState.errors.password || fieldErrors.password) && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.password?.message ??
                        fieldErrors.password?.[0]}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={login.isPending}
                >
                  {login.isPending ? "Signing in..." : "Log in"}
                </Button>
                </motion.div>
              </motion.form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
