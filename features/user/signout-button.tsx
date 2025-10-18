"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignoutButton() {
  const router = useRouter();
  const signOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login"); // redirect to login page
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button variant="outline" type="button" onClick={signOut}>
      Sign out
    </Button>
  );
}
