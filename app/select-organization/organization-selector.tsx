"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { BuildingIcon, CheckIcon, GalleryVerticalEnd } from "lucide-react";
import { Organization } from "better-auth/plugins";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { LoadingSwap } from "@/components/ui/loading-swap";

interface OrganizationSelectorProps {
  organizations: Organization[];
}

export function OrganizationSelector({
  organizations,
}: OrganizationSelectorProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleSelectOrganization = async (organizationId: string) => {
    await authClient.organization.setActive(
      {
        organizationId,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="space-y-4 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <BuildingIcon className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Select your organization
          </h1>
          <p className="text-lg text-muted-foreground">
            You&apos;re part of multiple organizations. Choose one to continue.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {organizations.map((organization) => {
            const metadata = organization.metadata
              ? JSON.parse(organization.metadata)
              : {};

            return (
              <Card
                onClick={() =>
                  startTransition(() =>
                    handleSelectOrganization(organization.id),
                  )
                }
                key={organization.id}
                className="w-full cursor-pointer transition-all hover:border-primary"
              >
                <LoadingSwap isLoading={isPending}>
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between overflow-hidden">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                          <GalleryVerticalEnd className="size-5" />
                        </div>
                        <div className="flex flex-col items-start gap-1">
                          <CardTitle className="text-left text-xl">
                            {organization.name}
                          </CardTitle>
                          {metadata.description && (
                            <CardDescription className="text-left text-sm">
                              {metadata.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </LoadingSwap>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
