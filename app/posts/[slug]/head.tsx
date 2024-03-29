import { textDecorationsToString } from "../../../lib/NotionUtils";
import { getDatabasePage, getPostDatabase, PostDatabaseItem } from "../../data";

export default async function Head({ params }: { params: { slug: string } }) {
  const posts = await getPostDatabase();
  const postId = posts.find((p) => p.Slug[0][0] === params.slug)?.id;
  let postName: string | undefined;
  if (postId !== undefined) {
    const { item: post } = await getDatabasePage<PostDatabaseItem>(postId);
    postName = textDecorationsToString(post.Title);
  }

  return (
    <>
      <title>
        {postName !== undefined ? `${postName} | paul shen` : "paul shen"}
      </title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
    </>
  );
}
