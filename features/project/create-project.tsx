"use client";
import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createProjectAction } from "./action";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function CreateProject({
  tenantId,
  children,
}: {
  tenantId: string;
  children?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(createProjectAction, {
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
        {children || <Button variant="outline">Create a new project</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Create a new project</DialogTitle>
            <DialogDescription>
              Create a new project for your tenant
            </DialogDescription>
          </DialogHeader>
          <>
            <input type="hidden" name="tenantId" value={tenantId} />
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
              {pending ? "Creating project..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
