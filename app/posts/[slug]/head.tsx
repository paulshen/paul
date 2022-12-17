import { textDecorationsToString } from "../../../lib/NotionUtils";
import { getPost, getPostDatabase } from "../../data";

export default async function Head({ params }: { params: { slug: string } }) {
  const posts = await getPostDatabase();
  const postId = posts.find((p) => p.Slug[0][0] === params.slug)?.id;
  let postName: string | undefined;
  if (postId !== undefined) {
    const { post } = await getPost(postId);
    postName = textDecorationsToString(post.Title);
  }

  return (
    <>
      <title>
        {postName !== undefined ? `${postName} | paul shen` : "paul shen"}
      </title>
    </>
  );
}