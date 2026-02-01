"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useSignup, useCities } from "@/lib/hooks";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ApiError } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";

const STEPS = [
  { id: 1, title: "Name", fields: ["firstName", "lastName"] as const },
  { id: 2, title: "Contact", fields: ["email", "phone"] as const },
  { id: 3, title: "Password", fields: ["password"] as const },
  { id: 4, title: "Location", fields: ["cityId"] as const },
] as const;

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(11, "Please enter a valid phone number (at least 11 digits)")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  cityId: z.string().min(1, "Please select your city"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const signup = useSignup();
  const { data: cities = [], isLoading: citiesLoading } = useCities();
  const error = signup.error as ApiError | null;
  const fieldErrors = error?.details ?? {};

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      cityId: "",
    },
    mode: "onBlur",
  });

  const totalSteps = STEPS.length;
  const currentStepConfig = STEPS[step - 1];

  async function handleNext() {
    const fieldsToValidate = currentStepConfig.fields;
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep((s) => Math.min(s + 1, totalSteps));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function onSubmit(data: SignupFormData) {
    signup.mutate(data);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
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
              <CardTitle>Create account</CardTitle>
              <CardDescription>
                Join your city&apos;s marketplace and start buying or selling.
              </CardDescription>
              <div className="mt-4 flex gap-2">
                {STEPS.map((s) => (
                  <motion.div
                    key={s.id}
                    className={`h-1.5 flex-1 rounded-full ${
                      s.id <= step ? "bg-primary" : "bg-muted"
                    }`}
                    title={s.title}
                    initial={false}
                    animate={{
                      scale: s.id === step ? 1.05 : 1,
                      opacity: s.id <= step ? 1 : 0.6,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Step {step} of {totalSteps}: {currentStepConfig.title}
              </p>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error.error}</AlertDescription>
                  </Alert>
                )}

                <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    className="space-y-5"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        autoComplete="given-name"
                        placeholder="Juan"
                        {...form.register("firstName")}
                      />
                      {(form.formState.errors.firstName ||
                        fieldErrors.firstName) && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.firstName?.message ??
                            fieldErrors.firstName?.[0]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Dela Cruz"
                        {...form.register("lastName")}
                      />
                      {(form.formState.errors.lastName ||
                        fieldErrors.lastName) && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.lastName?.message ??
                            fieldErrors.lastName?.[0]}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    className="space-y-5"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        {...form.register("email")}
                      />
                      {(form.formState.errors.email ||
                        fieldErrors.email) && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.email?.message ??
                            fieldErrors.email?.[0]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Controller
                        name="phone"
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            id="phone"
                            type="text"
                            inputMode="numeric"
                            autoComplete="tel"
                            placeholder="09123456789"
                            {...field}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, "");
                              field.onChange(v);
                            }}
                          />
                        )}
                      />
                      {(form.formState.errors.phone ||
                        fieldErrors.phone) && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.phone?.message ??
                            fieldErrors.phone?.[0]}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    className="space-y-2"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      {...form.register("password")}
                    />
                    {(form.formState.errors.password ||
                      fieldErrors.password) && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.password?.message ??
                          fieldErrors.password?.[0]}
                      </p>
                    )}
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    className="space-y-2"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="city">Your city</Label>
                    <Select
                      value={form.watch("cityId")}
                      onValueChange={(v) => form.setValue("cityId", v)}
                      disabled={citiesLoading}
                    >
                      <SelectTrigger id="city">
                        <SelectValue
                          placeholder={
                            citiesLoading
                              ? "Loading cities..."
                              : "Select your city"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(form.formState.errors.cityId ||
                      fieldErrors.cityId) && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.cityId?.message ??
                          fieldErrors.cityId?.[0]}
                      </p>
                    )}
                  </motion.div>
                )}
                </AnimatePresence>

                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  ) : (
                    <div className="flex-1" />
                  )}
                  {step < totalSteps ? (
                    <Button
                      type="button"
                      className="flex-1"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={signup.isPending}
                    >
                      {signup.isPending ? "Creating account..." : "Create account"}
                    </Button>
                  )}
                </motion.div>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Log in
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
