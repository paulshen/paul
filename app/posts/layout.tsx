import { PostsSidebar } from "../../lib/PostsSidebar";
import { getPostDatabase } from "../data";

export default async function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getPostDatabase();

  return (
    <div className="flex h-screen overflow-hidden">
      <PostsSidebar posts={posts} />
      <div className="grow overflow-y-auto">{children}</div>
    </div>
  );
}
