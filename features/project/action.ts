"use server";
import { auth } from "@/lib/auth";
import { checkPermission } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { APIError } from "better-auth";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  name: z.string({
    error: "Invalid Name",
  }),
  description: z.string({
    error: "Invalid Description",
  }),
  organizationId: z.string({
    error: "Invalid Organization ID",
  }),
});

export const createProjectAction = async (
  _prevState: { error: boolean; message: string | object },
  formData: FormData,
) => {
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    organizationId: formData.get("organizationId"),
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
    const userInOrganization = await auth.api.listMembers({
      query: {
        organizationId: validatedFields.data.organizationId,
        filterField: "userId",
        filterOperator: "eq",
        filterValue: session.user.id,
      },
      headers: await headers(),
    });

    if (userInOrganization.total === 0) {
      return {
        error: true,
        message:
          "You are not authorized to create a project in this organization",
      };
    }
  } catch (error) {
    if (error instanceof APIError) {
      return { error: true, message: error.message };
    }
    return { error: true, message: "An unknown error occurred" };
  }

  let project;
  try {
    [project] = await db
      .insert(projects)
      .values(validatedFields.data)
      .returning();

    updateTag(`organization:${validatedFields.data.organizationId}:projects`);
  } catch (error) {
    if (error instanceof Error) {
      return { error: true, message: error.message };
    }
    return { error: true, message: "An unknown error occurred" };
  }
  redirect(`/dashboard/${project.id}`);
};

export const deleteProjectAction = async (
  organizationId: string,
  projectId: string,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: true, message: "Unauthorized" };
  }
  const permission = await checkPermission({
    permissions: {
      project: ["delete", "create"],
    },
    errorMessage: "You are not authorized to delete this project",
  });

  if (permission.error) {
    return permission;
  }

  try {
    await db.delete(projects).where(eq(projects.id, projectId));

    updateTag(`project:${projectId}`);
    updateTag(`organization:${organizationId}:projects`);

    return { error: false, message: "Project deleted successfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: true, message: error.message };
    }
    return { error: true, message: "An unknown error occurred" };
  }
};
