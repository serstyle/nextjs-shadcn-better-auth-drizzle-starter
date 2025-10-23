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
import { toast } from "sonner";
import { Organization } from "better-auth/plugins";
import { updateOrganizationAction } from "./action";

export function UpdateOrganization({
  organization,
}: {
  organization: Organization;
}) {
  const [state, formAction, pending] = useActionState(
    (
      prevState: { error: boolean; message: string | object },
      formData: FormData,
    ) => updateOrganizationAction(prevState, formData, organization.id),
    {
      error: false,
      message: "",
    },
  );

  useEffect(() => {
    if (state.error) {
      if (typeof state.message === "object") {
        toast.error(
          Object.values(state.message).map((error: string[]) =>
            error.join(", "),
          ),
        );
      } else {
        toast.error(state.message);
      }
    }
    if (!state.error && state.message && typeof state.message === "string") {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Organization</CardTitle>
        <CardDescription>
          Enter your information below to update your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onReset={(e) => e.preventDefault()} action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Organization Name</FieldLabel>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="My Company"
                defaultValue={organization.name}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">
                Organization Description
              </FieldLabel>
              <Input
                id="description"
                type="textarea"
                name="description"
                placeholder="My Company is a software development company that specializes in building web applications."
                defaultValue={JSON.parse(organization.metadata).description}
                required
              />
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={pending}>
                  {pending ? "Updating organization..." : "Update Organization"}
                </Button>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
