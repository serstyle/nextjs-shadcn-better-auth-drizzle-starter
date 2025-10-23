import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createOrganizationAction } from "./action";

export const useCreateOrganization = () => {
  const [state, formAction, pending] = useActionState(
    createOrganizationAction,
    {
      error: "",
    },
  );

  useEffect(() => {
    if (state.error) {
      let errorMessage = JSON.stringify(state.error);
      if (typeof state.error === "string") {
        errorMessage = state.error;
      }
      if (typeof state.error === "object") {
        errorMessage = Object.values(state.error)
          .map((error: string[]) => error.join(", "))
          .join(", ");
      }
      toast.error(errorMessage);
    }
  }, [state.error]);

  return { state, formAction, pending };
};
