import { headers } from "next/headers";
import { auth } from "./auth";
import { APIError } from "better-auth";

export const checkPermission = async ({
  permissions,
  errorMessage,
}: {
  permissions: Parameters<
    typeof auth.api.hasPermission
  >[0]["body"]["permissions"];
  errorMessage: string;
}) => {
  try {
    const hasPermission = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: { ...permissions },
      },
    });

    if (hasPermission.success === false) {
      return {
        error: true,
        message: errorMessage,
      };
    }
  } catch (error) {
    if (error instanceof APIError) {
      return { error: true, message: error.message };
    }
    return { error: true, message: "An unknown error occurred" };
  }
  return { error: false, message: "Permission granted" };
};
