"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addMemberAction } from "./action";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DialogFormWithTrigger } from "@/components/dialog-form-with-trigger";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddMember({ children }: { children?: React.ReactNode }) {
  const [state, formAction, pending] = useActionState(
    (_: { error: boolean; message: string | object }, formData: FormData) =>
      addMemberAction(formData),
    {
      error: false,
      message: "",
    },
  );

  useEffect(() => {
    if (state.error && !pending) {
      let errorMessage = JSON.stringify(state.message);
      if (typeof state.message === "string") {
        errorMessage = state.message;
      }
      if (typeof state.message === "object") {
        errorMessage = Object.values(state.message)
          .map((error: string[]) => error.join(", "))
          .join(", ");
      }
      toast.error(errorMessage);
    }
    if (
      !state.error &&
      state.message &&
      typeof state.message === "string" &&
      !pending
    ) {
      toast.success(state.message);
    }
  }, [state.error, state.message, pending]);

  return (
    <DialogFormWithTrigger
      formAction={formAction}
      trigger={children || <Button variant="outline">Add a new member</Button>}
    >
      <DialogHeader>
        <DialogTitle>Add a new member</DialogTitle>
        <DialogDescription>
          Add a new member to the organization
        </DialogDescription>
      </DialogHeader>
      <>
        <div className="grid gap-3">
          <Label htmlFor="name-1">Member Email</Label>
          <Input id="name-1" name="memberEmail" />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="role-1">Role</Label>
          <Select defaultValue="member" name="role">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </>
      <DialogFooter>
        <DialogClose disabled={pending} asChild>
          <Button disabled={pending} variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={pending}>
          {pending ? "Adding member..." : "Add Member"}
        </Button>
      </DialogFooter>
    </DialogFormWithTrigger>
  );
}
