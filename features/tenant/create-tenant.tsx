"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DialogFormWithTrigger } from "@/components/dialog-form-with-trigger";
import { useCreateTenant } from "./hooks";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";

export function CreateTenant({ children }: { children?: React.ReactNode }) {
  const { formAction, pending } = useCreateTenant();
  return (
    <DialogFormWithTrigger
      formAction={formAction}
      trigger={
        children || <Button variant="outline">Create a new tenant</Button>
      }
    >
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
    </DialogFormWithTrigger>
  );
}

export function CreateTenantForm() {
  const { formAction, pending } = useCreateTenant();
  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name-1" className="text-sm font-medium">
            Workspace Name
          </Label>
          <Input
            id="name-1"
            name="name"
            placeholder="e.g., Acme Corp"
            className="h-11"
            required
          />
          <p className="text-xs text-muted-foreground">
            Choose a name for your workspace
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description-1" className="text-sm font-medium">
            Description
          </Label>
          <Input
            id="description-1"
            name="description"
            placeholder="What's this workspace for?"
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Optional: Add a brief description
          </p>
        </div>
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full text-base"
        size="lg"
      >
        {pending ? (
          <>
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            Creating workspace...
          </>
        ) : (
          <>
            Create Workspace
            <ArrowRightIcon className="ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}
