import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export const getProjectsByOrganizationId = async (organizationId: string) => {
  "use cache";
  cacheTag(`organization:${organizationId}:projects`);
  try {
    const projectsQuery = await db.query.projects.findMany({
      where: eq(projects.organizationId, organizationId),
    });
    return projectsQuery;
  } catch (error) {
    if (error instanceof Error) {
      return [];
    }
    return [];
  }
};

export const getProjectById = async (
  projectId: string,
  activeOrganizationId: string,
) => {
  "use cache";
  cacheTag(`project:${projectId}`);
  try {
    const projectQuery = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, projectId),
        eq(projects.organizationId, activeOrganizationId),
      ),
      with: {
        organization: {
          columns: {
            name: true,
          },
        },
      },
    });
    return projectQuery;
  } catch (error) {
    if (error instanceof Error) {
      return null;
    }
    return null;
  }
};
