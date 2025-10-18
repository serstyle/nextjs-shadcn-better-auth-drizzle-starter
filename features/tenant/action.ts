"use server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tenants, tenantsUsers, user } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DatabaseError } from "pg";
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


export const addMemberAction = async (
  prevState: any,
  formData: FormData,
  tenantId: string,
) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const validatedFields = z.object({
    memberEmail: z.string({
      error: "Invalid Member Email",
    }).min(1, {
      message: "Member Email is required",
    }),
  }).safeParse({
    memberEmail: formData.get("memberEmail"),
  });
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }
  const memberEmail = validatedFields.data.memberEmail;
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
  const member = await db.query.user.findFirst({
    where: eq(user.email, memberEmail),
  });
  if (!member) {
    return { error: "Member not found" };
  }
  try {
    await db.insert(tenantsUsers).values({
      tenantId: tenantId,
      userId: member.id,
    });
    revalidatePath(`/dashboard/${tenantId}`);
  } catch (error) {
    if (error instanceof Error && error.cause instanceof DatabaseError) {
      if (error.cause?.constraint === "tenant_user_unique") {
        return { error: "Member already in tenant" };
      }
    }
    return { error: "Something went wrong" };
  }
  return { success: true, error: "" };
}

export const removeMemberAction = async (
  tenantId: string,
  memberId: string,
) => {
await new Promise(resolve => setTimeout(resolve, 1000));


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
    await db.delete(tenantsUsers).where(and(
      eq(tenantsUsers.tenantId, tenantId),
      eq(tenantsUsers.userId, memberId),
    ));
    revalidatePath(`/dashboard/${tenantId}`);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
  return { success: true, error: "" };
}