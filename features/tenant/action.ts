"use server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tenants, tenantsUsers } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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

export const createTenantAction = async (
  prevState: any,
  formData: FormData,
) => {
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
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

  let tenant;
  try {
    tenant = await db.transaction(async (tx) => {
      const [newTenant] = await tx
        .insert(tenants)
        .values(validatedFields.data)
        .returning();

      await tx.insert(tenantsUsers).values({
        tenantId: newTenant.id,
        userId: session.user.id,
      });
      return newTenant;
      // revalidatePath(`/dashboard/${tenant.id}`, "layout");
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }

  redirect(`/dashboard/${tenant.id}`);
};

export const updateTenantAction = async (
  prevState: any,
  formData: FormData,
  tenantId: string,
) => {
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
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
      eq(tenantsUsers.tenantId, tenantId),
      eq(tenantsUsers.userId, session.user.id),
    ),
  });

  if (!userInTenant) {
    return { error: "Unauthorized" };
  }
  try {
    await db
      .update(tenants)
      .set(validatedFields.data)
      .where(eq(tenants.id, tenantId));
    revalidatePath(`/dashboard/${tenantId}`);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
  return { success: true, error: "" };
};
