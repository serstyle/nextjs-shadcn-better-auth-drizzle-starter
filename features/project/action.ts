"use server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, tenantsUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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
  tenantId: z.string({
    error: "Invalid Tenant ID",
  }),
});

export const createProjectAction = async (
  _prevState: { error: string | object },
  formData: FormData,
) => {
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    tenantId: formData.get("tenantId"),
  });
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }
  const userInTenant = await db.query.tenantsUsers.findFirst({
    where: and(
      eq(tenantsUsers.userId, session.user.id),
      eq(tenantsUsers.tenantId, validatedFields.data.tenantId),
    ),
  });

  if (!userInTenant) {
    return {
      error: "You are not authorized to create a project in this tenant",
    };
  }
  let project;
  try {
    [project] = await db
      .insert(projects)
      .values(validatedFields.data)
      .returning();
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }
  redirect(`/dashboard/${validatedFields.data.tenantId}/${project.id}`);
};

export const deleteProjectAction = async (
  tenantId: string,
  projectId: string,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }
  const userInTenant = await db.query.tenantsUsers
    .findFirst({
      where: and(
        eq(tenantsUsers.userId, session.user.id),
        eq(tenantsUsers.tenantId, tenantId),
      ),
      with: {
        tenant: {
          with: {
            projects: {
              where: eq(projects.id, projectId),
            },
          },
        },
      },
    })
    .catch(() => {
      return null;
    });
  if (!userInTenant?.tenant?.projects.length) {
    return { error: "Project not found" };
  }
  try {
    await db.delete(projects).where(eq(projects.id, projectId));
    revalidatePath(`/dashboard/${tenantId}`);
    return { success: true, error: "" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }
};
