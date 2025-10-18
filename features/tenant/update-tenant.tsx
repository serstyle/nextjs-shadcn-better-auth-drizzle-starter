"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect } from "react";
import { updateTenantAction } from "./action";
import { toast } from "sonner";
import { InferSelectModel } from "drizzle-orm";
import { tenants } from "@/lib/db/schema";

export function UpdateTenant({
  tenant,
}: {
  tenant: InferSelectModel<typeof tenants>;
}) {
  const [state, formAction, pending] = useActionState(
    (prevState: { error: object | string }, formData: FormData) =>
      updateTenantAction(prevState, formData, tenant.id),
    {
      error: "",
    },
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Tenant updated successfully");
    }
    if (state?.error) {
      if (typeof state.error === "object") {
        toast.error(
          Object.values(state.error).map((error: string[]) => error.join(", ")),
        );
      } else {
        toast.error(state.error);
      }
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Tenant</CardTitle>
        <CardDescription>
          Enter your information below to update your tenant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onReset={(e) => e.preventDefault()} action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Tenant Name</FieldLabel>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="My Company"
                defaultValue={tenant.name}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Tenant Description</FieldLabel>
              <Input
                id="description"
                type="textarea"
                name="description"
                placeholder="My Company is a software development company that specializes in building web applications."
                defaultValue={tenant.description ?? ""}
                required
              />
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={pending}>
                  {pending ? "Updating tenant..." : "Update Tenant"}
                </Button>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
