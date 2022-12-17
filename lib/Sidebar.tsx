"use client";
import classNames from "classnames";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { textDecorationsToString } from "./NotionUtils";

function SidebarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSelected = href === pathname;

  return (
    <Link
      href={href}
      className={classNames(
        "group rounded block px-2 py-2 text-sm max-lg:text-xs font-medium",
        isSelected ? "is-selected bg-slate-100" : "hover:bg-gray-50"
      )}
    >
      {children}
    </Link>
  );
}

function TopMenu() {
  return (
    <div className="px-2 flex flex-col gap-1 py-2">
      <SidebarLink href="/posts">posts</SidebarLink>
      <SidebarLink href="/projects">projects</SidebarLink>
      <SidebarLink href="/scribbles">scribbles</SidebarLink>
    </div>
  );
}

function PostsList({ posts }: { posts: any[] }) {
  return (
    <div className="px-2 flex flex-col gap-1 py-2">
      {posts.map((post) => (
        <SidebarLink href={`/posts/${post.Slug}`} key={post.id}>
          <div>{textDecorationsToString(post.Title)}</div>
          {post.Date !== undefined ? (
            <div className="text-xs text-opacity-50 text-gray-600 font-normal">
              {post.Date}
            </div>
          ) : null}
        </SidebarLink>
      ))}
    </div>
  );
}

export function Sidebar({ posts }: { posts: any[] }) {
  const segments = useSelectedLayoutSegments();

  let currentMarker = null;
  switch (segments[0]) {
    case "posts":
      currentMarker = <Link href="/posts">posts</Link>;
      break;
    case "projects":
      currentMarker = <Link href="/projects">projects</Link>;
      break;
    case "scribbles":
      currentMarker = <Link href="/scribbles">scribbles</Link>;
      break;
  }

  return (
    <div className="w-80 max-lg:w-64 max-md:hidden flex-shrink-0 border-r border-gray-100 h-full overflow-y-auto">
      <div className="px-4 py-3 text-xs flex gap-3 border-b border-gray-100">
        <Link href="/" className="text-gray-400">
          paul shen
        </Link>
        {currentMarker}
      </div>
      {segments[0] === "posts" ? <PostsList posts={posts} /> : <TopMenu />}
    </div>
  );
}
