import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AccountDialog({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setName(user?.name || "");
  }, [user]);
  const updateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await authClient.updateUser(
      {
        name,
      },
      {
        onSuccess: () => {
          toast.success("Account updated successfully");
        },
        onError: () => {
          toast.error("Failed to update account");
        },
      },
    );
    setIsLoading(false);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Account</DialogTitle>
            <DialogDescription>
              Update your account information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={updateUser}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              {/* <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field> */}
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating account..." : "Update Account"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
