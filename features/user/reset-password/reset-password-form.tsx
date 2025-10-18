"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function ResetPasswordForm({
  className,
  token,
  ...props
}: React.ComponentProps<"div"> & { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const resetPassword = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      if (password !== confirmPassword) {
        toast.error("Passwords do not match", {
          dismissible: true,
        });
        setIsLoading(false);
        return;
      }
      await authClient.resetPassword(
        {
          newPassword: password,
          token,
        },
        {
          onSuccess: () => {
            toast.success("Password reset successfully", {
              dismissible: true,
            });
            router.push("/login");
          },
          onError: ({ error }) => {
            toast.error(error.message, {
              dismissible: true,
            });
          },
        },
      );
      setIsLoading(false);
    },
    [password, confirmPassword, token, router],
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={resetPassword}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="New Password"
                  name="password"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Resetting
                      password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Remember your password? <Link href="/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
