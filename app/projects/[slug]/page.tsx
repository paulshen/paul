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

  const { post, recordMap } = await getDatabasePage<ProjectDatabaseItem>(
    projectId
  );
  return (
    <div className="px-4 lg:pl-16">
      <div className="w-full max-w-lg pt-12 pb-12 max-lg:mx-auto">
        <div className="text-3xl font-semibold mb-8 text-gray-900">
          {textDecorationsToString(post.Name)}
        </div>
        <NotionBlock blockId={projectId} recordMap={recordMap} />
      </div>
    </div>
  );
}
