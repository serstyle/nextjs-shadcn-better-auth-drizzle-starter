import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getCurrentOrganization = async () => {
  try {
    const organization = await auth.api.getFullOrganization({
      headers: await headers(),
    });
    if (!organization) {
      return redirect("/onboarding");
    }
    return organization;
  } catch (error) {
    if (error instanceof APIError) {
      return redirect("/onboarding");
    }
    return redirect("/onboarding");
  }
};

export const getUserOrganizations = async () => {
  try {
    const organizations = await auth.api.listOrganizations({
      headers: await headers(),
    });
    return organizations;
  } catch (error) {
    if (error instanceof APIError) {
      return redirect("/onboarding");
    }
    return redirect("/onboarding");
  }
};
