"use server";
import { auth } from "@/lib/auth";
import { checkPermission } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { APIError } from "better-auth";
import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  name: z
    .string({
      error: "Invalid Name",
    })
    .min(1, {
      message: "Name is required",
    }),
  description: z
    .string({
      error: "Invalid Description",
    })
    .min(1, {
      message: "Description is required",
    }),
});

const generateSlug = (name: string) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
};

export const createOrganizationAction = async (
  _prevState: { error: boolean; message: string | object },
  formData: FormData,
) => {
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!validatedFields.success) {
    return {
      error: true,
      message: validatedFields.error.flatten().fieldErrors,
    };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: true, message: "Unauthorized" };
  }

  try {
    const organization = await auth.api.createOrganization({
      body: {
        name: validatedFields.data.name,
        slug: generateSlug(validatedFields.data.name),
        metadata: {
          description: validatedFields.data.description,
        },
      },
      headers: await headers(),
    });

    if (!organization) {
      return { error: true, message: "Failed to create organization" };
    }

    const data = await auth.api.setActiveOrganization({
      body: {
        organizationSlug: organization.slug,
      },
      headers: await headers(),
    });

    if (!data) {
      return { error: true, message: "Failed to set active organization" };
    }
  } catch (error) {
    if (error instanceof APIError) {
      return {
        error: true,
        message: error.message || "An unknown error occurred",
      };
    }
    return { error: true, message: "An unknown error occurred" };
  }

  redirect(`/dashboard`);
};

export const updateOrganizationAction = async (
  _prevState: { error: boolean; message: string | object },
  formData: FormData,
  organizationId: string,
) => {
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!validatedFields.success) {
    return {
      error: true,
      message: validatedFields.error.flatten().fieldErrors,
    };
  }
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: true, message: "Unauthorized" };
  }

  try {
    await auth.api.updateOrganization({
      body: {
        data: {
          name: validatedFields.data.name,
          slug: generateSlug(validatedFields.data.name),
          metadata: {
            description: validatedFields.data.description,
          },
        },
        organizationId: organizationId,
      },
      headers: await headers(),
    });
    refresh();
  } catch (error) {
    if (error instanceof APIError) {
      return { error: true, message: error.message };
    }
  }
  return { error: false, message: "Organization updated successfully" };
};

export const addMemberAction = async (formData: FormData) => {
  const validatedFields = z
    .object({
      memberEmail: z
        .string({
          error: "Invalid Member Email",
        })
        .min(1, {
          message: "Member Email is required",
        }),
      role: z.enum(["admin", "member"]).default("member"),
    })
    .safeParse({
      memberEmail: formData.get("memberEmail"),
    });
  if (!validatedFields.success) {
    return {
      error: true,
      message: validatedFields.error.flatten().fieldErrors,
    };
  }
  const memberEmail = validatedFields.data.memberEmail;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: true, message: "Unauthorized" };
  }

  const permission = await checkPermission({
    permissions: {
      member: ["create"],
    },
    errorMessage: "You are not authorized to add a member to this organization",
  });
  if (permission.error) {
    return permission;
  }

  const userExists = await db.query.user.findFirst({
    where: eq(user.email, memberEmail),
  });
  if (!userExists) {
    return { error: true, message: "User not found" };
  }
  try {
    await auth.api.addMember({
      body: {
        userId: userExists.id,
        role: validatedFields.data.role,
      },
      headers: await headers(),
    });
    refresh();
  } catch (error) {
    if (error instanceof Error) {
      return { error: true, message: error.message };
    }
    return { error: true, message: "An unknown error occurred" };
  }
  return { error: false, message: "Member added successfully" };
};
