"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTenantAction } from "./action";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function CreateTenant({ children }: { children?: React.ReactNode }) {
  const [state, formAction, pending] = useActionState(createTenantAction, {
    error: "",
  });

  useEffect(() => {
    if (state.error) {
      let errorMessage = JSON.stringify(state.error);
      if (typeof state.error === "string") {
        errorMessage = state.error;
      }
      if (typeof state.error === "object") {
        errorMessage = Object.values(state.error)
          .map((error: string[]) => error.join(", "))
          .join(", ");
      }
      toast.error(errorMessage);
    }
  }, [state.error]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || <Button variant="outline">Create a new tenant</Button>}
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-[425px]">
          <form action={formAction}>
            <DialogHeader>
              <DialogTitle>Create a new tenant</DialogTitle>
              <DialogDescription>Create a new tenant</DialogDescription>
            </DialogHeader>
            <>
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input id="name-1" name="name" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description-1">Description</Label>
                <Input id="description-1" name="description" />
              </div>
            </>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={pending}>
                {pending ? "Creating tenant..." : "Create Tenant"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
