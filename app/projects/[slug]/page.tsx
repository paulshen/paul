import { NotionBlock } from "../../../lib/NotionBlock";
import { textDecorationsToString } from "../../../lib/NotionUtils";
import {
  getDatabasePage,
  getProjectsDatabase,
  ProjectDatabaseItem,
} from "../../data";

export async function generateStaticParams() {
  const projects = await getProjectsDatabase();

  return projects.map((project) => ({
    id: project.id,
    slug: project.Slug[0][0],
  }));
}

export const revalidate = 60;

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const projects = await getProjectsDatabase();
  const projectId = projects.find((p) => p.Slug[0][0] === params.slug)?.id;
  if (projectId === undefined) {
    return <div>project not found</div>;
  }

  const { item: project, recordMap } =
    await getDatabasePage<ProjectDatabaseItem>(projectId);
  return (
    <div className="px-6 lg:pl-16">
      <div className="w-full max-w-lg pt-16 pb-24 max-lg:mx-auto">
        <div className="mb-8">
          <div className="text-3xl font-semibold text-gray-900">
            {textDecorationsToString(project.Name)}
          </div>
          {project.URL?.length > 0 ? (
            <div className="mt-4">
              <a
                href={project.URL}
                target="_blank"
                rel="noreferrer"
                className="inline-block px-3 py-1 border border-gray-500 rounded"
              >
                {"visit ->"}
              </a>
            </div>
          ) : null}
        </div>
        <NotionBlock blockId={projectId} recordMap={recordMap} />
      </div>
    </div>
  );
}
