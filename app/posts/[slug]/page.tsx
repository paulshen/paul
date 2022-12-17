import { NotionBlock } from "../../../lib/NotionBlock";
import { textDecorationsToString } from "../../../lib/NotionUtils";
import { getDatabasePage, getPostDatabase, PostDatabaseItem } from "../../data";

export async function generateStaticParams() {
  const posts = await getPostDatabase();

  return posts.map((post) => ({
    id: post.id,
    slug: post.Slug[0][0],
  }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const posts = await getPostDatabase();
  const postId = posts.find((p) => p.Slug[0][0] === params.slug)?.id;
  if (postId === undefined) {
    return <div>post not found</div>;
  }

  const { post, recordMap } = await getDatabasePage<PostDatabaseItem>(postId);
  return (
    <div className="px-4 lg:pl-16">
      <div className="w-full max-w-lg pt-12 pb-12 max-lg:mx-auto">
        <div className="text-3xl font-semibold mb-8 text-gray-900">
          {textDecorationsToString(post.Title)}
        </div>
        <NotionBlock blockId={postId} recordMap={recordMap} />
      </div>
    </div>
  );
}
