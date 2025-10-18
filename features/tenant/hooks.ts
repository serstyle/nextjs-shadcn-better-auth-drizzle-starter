import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createTenantAction, removeMemberAction } from "./action";

export const useCreateTenant = () => {
  const [state, formAction, pending] = useActionState(createTenantAction, {
    error: "",
  });

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

export const useRemoveMember = (tenantId: string, memberId: string) => {
  const [state, formAction, pending] = useActionState(
    () => removeMemberAction(tenantId, memberId),
    {
      error: "",
    },
  );
  useEffect(() => {
    if (state.error && !pending) {
      toast.error(state.error);
    }
    if (state.success && !pending) {
      toast.success("Member removed successfully");
    }
  }, [state.error, state.success, pending]);
  return { formAction, pending, state };
};
