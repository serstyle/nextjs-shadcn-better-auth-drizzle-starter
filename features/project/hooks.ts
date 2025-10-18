import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { deleteProjectAction } from "./action";

export const useRemoveProject = (tenantId: string, projectId: string) => {
  const [state, formAction, pending] = useActionState(
    () => deleteProjectAction(tenantId, projectId),
    {
      error: "",
    },
  );
  useEffect(() => {
    if (state.error && !pending) {
      toast.error(state.error);
    }
    if (state.success && !pending) {
      toast.success("Project deleted successfully");
    }
  }, [state, pending]);
  return { formAction, pending, state };
};
