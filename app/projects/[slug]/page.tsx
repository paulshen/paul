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
        <div className="text-3xl font-semibold text-gray-900 mb-8">
          {textDecorationsToString(project.Name)}
        </div>
        <NotionBlock blockId={projectId} recordMap={recordMap} />
      </div>
    </div>
  );
}
