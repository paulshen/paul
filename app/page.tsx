import Link from "next/link";

function MyLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="font-medium text-gray-900 hover:underline">
      {children}
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen px-4">
      <div className="w-full max-w-lg pt-32 pb-12 mx-auto text-sm">
        <div className="text-gray-400 mb-8">
          <div>hi! i'm paul.</div>
          <div>i'll find something to put here.</div>
        </div>
        <div>
          <MyLink href="/posts">posts</MyLink>
        </div>
        <div>
          <MyLink href="/projects">projects</MyLink>
        </div>
        <div>
          <MyLink href="/scribbles">scribbles</MyLink>
        </div>
      </div>
    </div>
  );
}
