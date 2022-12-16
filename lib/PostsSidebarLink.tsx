"use client";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { textDecorationsToString } from "./NotionUtils";

export function PostsSidebarLink({ post }: { post: any }) {
  const pathname = usePathname();
  const postPath = `/posts/${post.Slug}`;
  const isSelected = postPath === pathname;

  return (
    <Link
      href={postPath}
      className={classNames(
        "rounded block px-2 py-2",
        isSelected ? "bg-sky-800 text-white" : "hover:bg-gray-100"
      )}
    >
      <div className="text-sm max-lg:text-xs font-medium">
        {textDecorationsToString(post.Title)}
      </div>
      {post.Date !== undefined ? (
        <div
          className={classNames(
            "text-xs text-opacity-50",
            isSelected ? "text-white" : "text-gray-600"
          )}
        >
          {post.Date}
        </div>
      ) : null}
    </Link>
  );
}
