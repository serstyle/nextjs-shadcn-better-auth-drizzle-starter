"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Loader2, MoreHorizontal, UserMinus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeMemberAction } from "@/features/tenant/action";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

export type Member = {
  tenantId: string;
  memberId: string;
  name: string;
  email: string;
  createdAt: Date;
};

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Joined At",
    cell: ({ row }) => {
      return <div>{row.original.createdAt.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const member = row.original;
      return <MemberActions member={member} />;
    },
  },
];

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

export const MemberActions = ({ member }: { member: Member }) => {
  const { formAction, pending } = useRemoveMember(
    member.tenantId,
    member.memberId,
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={pending}>
          <span className="sr-only">Open menu</span>
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => startTransition(formAction)}
        >
          <UserMinus className="text-destructive" />
          {pending ? "Removing member..." : "Remove member"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
