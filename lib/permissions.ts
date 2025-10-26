import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";
import { createAccessControl } from "better-auth/plugins/access";
/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
  ...defaultStatements,
  project: ["create", "update", "delete"],
} as const;
export const ac = createAccessControl(statement);

export const member = ac.newRole({
  ...memberAc.statements,
  member: ["delete"],
  project: ["create"],
});
export const admin = ac.newRole({
  ...adminAc.statements,
  project: ["create", "update"],
});

export const owner = ac.newRole({
  ...ownerAc.statements,
  project: ["create", "update", "delete"],
});
