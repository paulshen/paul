import { getPostDatabase } from "../data";
import Link from "next/link";

export default async function PostsIndex() {
  const posts = await getPostDatabase();

  return (
    <div>
      <div>posts index</div>
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <Link href={`/posts/${post.Slug}`}>{post.Title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
