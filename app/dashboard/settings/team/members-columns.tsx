"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, UserMinus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Member } from "better-auth/plugins";
import { authClient } from "@/lib/auth-client";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "user.name",
    header: "Name",
  },
  {
    accessorKey: "user.email",
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

export const MemberActions = ({ member }: { member: Member }) => {
  const router = useRouter();
  const handleRemoveMember = () => {
    return authClient.organization.removeMember(
      {
        memberIdOrEmail: member.id,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <BetterAuthActionButton
            action={handleRemoveMember}
            successMessage="Member removed successfully"
            requireAreYouSure
            variant="ghost"
            className="text-destructive"
            asChild
          >
            <div className="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-destructive/10 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:!text-destructive">
              <UserMinus className="text-destructive" />
              <span className="text-destructive">Remove member</span>
            </div>
          </BetterAuthActionButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
