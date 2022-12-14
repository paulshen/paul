import React from "react";
import { renderNotionBlock } from "../../../lib/NotionBlockRenderer";
import { NotionText } from "../../../lib/NotionText";
import { getPost, getPostDatabase } from "../../data";

export async function generateStaticParams() {
  const posts = await getPostDatabase();

  return posts.map((post) => ({
    id: post.id,
    slug: post.Slug[0][0],
  }));
}

export default async function PostsPage({
  params,
}: {
  params: { slug: string };
}) {
  const posts = await getPostDatabase();
  const postId = posts.find((p) => p.Slug[0][0] === params.slug)?.id;
  if (postId === undefined) {
    return <div>post not found</div>;
  }
  const { post, recordMap } = await getPost(postId);
  return (
    <div className="flex justify-center">
      <div className="max-w-lg text-sm">
        {post.content.map((childBlock) => {
          return (
            <React.Fragment key={childBlock.id}>
              {renderNotionBlock(childBlock, recordMap)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
