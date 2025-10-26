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
import { useCreateOrganization } from "./hooks";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";

export function CreateOrganization({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { formAction, pending } = useCreateOrganization();

  return (
    <DialogFormWithTrigger
      formAction={formAction}
      trigger={
        children || <Button variant="outline">Create a new organization</Button>
      }
    >
      <DialogHeader>
        <DialogTitle>Create a new organization</DialogTitle>
        <DialogDescription>Create a new organization</DialogDescription>
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
          {pending ? "Creating organization..." : "Create Organization"}
        </Button>
      </DialogFooter>
    </DialogFormWithTrigger>
  );
}

export function CreateOrganizationForm() {
  const { formAction, pending } = useCreateOrganization();
  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name-1" className="text-sm font-medium">
            Organization Name
          </Label>
          <Input
            id="name-1"
            name="name"
            placeholder="e.g., Acme Corp"
            className="h-11"
            required
          />
          <p className="text-xs text-muted-foreground">
            Choose a name for your organization
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description-1" className="text-sm font-medium">
            Description
          </Label>
          <Input
            id="description-1"
            name="description"
            placeholder="What's this organization for?"
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
            Creating organization...
          </>
        ) : (
          <>
            Create Organization
            <ArrowRightIcon className="ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}
