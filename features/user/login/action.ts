"use server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  email: z.string({
    error: "Invalid Email",
  }),
  password: z.string({
    error: "Invalid Password",
  }),
});

const loginAction = async (
  _prevState: { error: object | string },
  formData: FormData,
) => {
  const validatedFields = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: validatedFields.data.email,
        password: validatedFields.data.password,
        callbackURL: "/dashboard",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }
  redirect("/dashboard");
};

export { loginAction };
