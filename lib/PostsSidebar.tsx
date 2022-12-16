import { PostsSidebarLink } from "./PostsSidebarLink";

export function PostsSidebar({ posts }: { posts: any[] }) {
  return (
    <div className="w-80 max-lg:w-64 max-md:hidden flex-shrink-0 border-r border-gray-100 h-full overflow-y-auto py-2">
      <div className="px-2 flex flex-col gap-1">
        {posts.map((post) => (
          <PostsSidebarLink post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}
