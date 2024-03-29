"use client";
import { DoubleArrowLeftIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import classNames from "classnames";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { useEffect, useState } from "react";
import { PostDatabaseItem, ProjectDatabaseItem } from "../app/data";
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
        "group rounded block px-2 py-2 text-sm max-lg:text-xs font-medium text-neutral-900",
        isSelected ? "is-selected bg-accent-100" : "hover:bg-neutral-50"
      )}
    >
      {children}
    </Link>
  );
}

function TopMenu() {
  return (
    <div className="px-2 flex flex-col gap-1 py-2">
      <SidebarLink href="/">home</SidebarLink>
      <SidebarLink href="/posts">posts</SidebarLink>
      <SidebarLink href="/projects">projects</SidebarLink>
      <SidebarLink href="/scribbles">scribbles</SidebarLink>
    </div>
  );
}

function PostsList({ posts }: { posts: PostDatabaseItem[] }) {
  return (
    <div className="px-2 flex flex-col gap-1 py-2">
      {posts.map((post) => (
        <SidebarLink href={`/posts/${post.Slug}`} key={post.id}>
          <div>{textDecorationsToString(post.Title)}</div>
          {post.Date !== undefined ? (
            <div className="text-xs text-opacity-50 text-neutral-600 font-normal">
              {post.Date}
            </div>
          ) : null}
        </SidebarLink>
      ))}
    </div>
  );
}

function ProjectsList({ projects }: { projects: ProjectDatabaseItem[] }) {
  return (
    <div className="px-2 flex flex-col gap-1 py-2">
      {projects.map((project) => (
        <SidebarLink href={`/projects/${project.Slug}`} key={project.id}>
          <div>{textDecorationsToString(project.Name)}</div>
          {project.Tagline !== undefined ? (
            <div className="text-xs text-opacity-50 text-neutral-600 font-normal">
              {project.Tagline}
            </div>
          ) : null}
        </SidebarLink>
      ))}
    </div>
  );
}

export function Sidebar({
  posts,
  projects,
}: {
  posts: PostDatabaseItem[];
  projects: ProjectDatabaseItem[];
}) {
  const pathname = usePathname();
  const segments = useSelectedLayoutSegments();
  const [showCollapsed, setShowCollapsed] = useState(false);

  useEffect(() => {
    setShowCollapsed(false);
    setForceShowTopMenu(false);
  }, [pathname]);
  if (
    segments.length === 1 &&
    ["posts", "projects"].includes(segments[0]) &&
    !showCollapsed
  ) {
    setShowCollapsed(true);
  }

  const [forceShowTopMenu, setForceShowTopMenu] = useState(false);
  if (!["posts", "projects"].includes(segments[0]) && forceShowTopMenu) {
    setForceShowTopMenu(false);
  }

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsInitialLoad(false);
    }, 100);
  }, []);

  let currentMarker = null;
  switch (segments[0]) {
    case "posts":
      currentMarker = (
        <Link href="/posts" className="font-medium">
          posts
        </Link>
      );
      break;
    case "projects":
      currentMarker = (
        <Link href="/projects" className="font-medium">
          projects
        </Link>
      );
      break;
  }

  return (
    <>
      <button
        onClick={() => {
          setShowCollapsed((v) => !v);
        }}
        className="md:hidden absolute top-5 left-5 p-1 text-neutral-400 hover:text-neutral-600 transition z-10"
      >
        <HamburgerMenuIcon />
      </button>
      {showCollapsed ? (
        <div
          onClick={() => {
            setShowCollapsed(false);
          }}
          className="fixed top-0 bottom-0 left-0 right-0 md:hidden z-10"
        />
      ) : null}
      <div
        className={classNames(
          "fixed flex flex-col w-80 bg-white max-lg:w-64 flex-shrink-0 border-r border-neutral-100 z-10 top-0 bottom-0 left-0 transform transition",
          { transition: !isInitialLoad },
          !showCollapsed ? "max-md:-translate-x-full max-md:opacity-50" : ""
        )}
      >
        <div className="pl-4 pr-2 py-5 text-xs flex items-center gap-3 border-b border-neutral-100">
          <Link
            href="/"
            onClick={(e) => {
              if (segments.length >= 2 && !forceShowTopMenu) {
                setForceShowTopMenu(true);
                e.preventDefault();
              }
            }}
            className="text-neutral-400 hover:text-neutral-600 transition"
          >
            paul shen
          </Link>
          {currentMarker}
          <div className="grow" />
          {segments.length === 1 &&
          ["posts", "projects"].includes(segments[0]) ? null : (
            <button
              onClick={() => {
                setShowCollapsed(false);
              }}
              className="md:hidden text-neutral-400 hover:text-neutral-600 transition"
            >
              <DoubleArrowLeftIcon />
            </button>
          )}
        </div>
        <div className="grow overflow-auto">
          {segments[0] === "posts" && !forceShowTopMenu ? (
            <PostsList posts={posts} />
          ) : segments[0] === "projects" && !forceShowTopMenu ? (
            <ProjectsList projects={projects} />
          ) : (
            <TopMenu />
          )}
        </div>
      </div>
    </>
  );
}
