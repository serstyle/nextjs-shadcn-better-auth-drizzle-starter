import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { ac, admin, member, owner } from "./permissions";
export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac: ac,
      roles: {
        member: member,
        admin: admin,
        owner: owner,
      },
    }),
  ],
});
