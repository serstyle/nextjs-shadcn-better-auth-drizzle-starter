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
  confirmPassword: z.string({
    error: "Invalid Confirm Password",
  }),
  name: z.string({
    error: "Invalid Name",
  }),
});

const signupAction = async (prevState: any, formData: FormData) => {
  const validatedFields = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirm-password"),
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  if (validatedFields.data.password !== validatedFields.data.confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email: validatedFields.data.email,
        password: validatedFields.data.password,
        name: validatedFields.data.name,
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

export { signupAction };
