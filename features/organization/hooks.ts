import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createOrganizationAction } from "./action";

export const useCreateOrganization = () => {
  const [state, formAction, pending] = useActionState(
    createOrganizationAction,
    {
      error: false,
      message: "",
    },
  );

  useEffect(() => {
    if (state.error) {
      let errorMessage = JSON.stringify(state.message);
      if (typeof state.message === "string") {
        errorMessage = state.message;
      }
      if (typeof state.message === "object") {
        errorMessage = Object.values(state.message)
          .map((error: string[]) => error.join(", "))
          .join(", ");
      }
      toast.error(errorMessage);
    }
  }, [state]);

  return { state, formAction, pending };
};
