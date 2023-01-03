import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-lg py-16 max-md:pt-24 px-12 max-md:px-6 text-sm">
      <div className="font-medium text-neutral-700 text-lg">
        <div className="mb-8">
          <div>Hi, I'm Paul.</div>
          <div>I enjoy designing and making software.</div>
        </div>
        <div>
          This site is{" "}
          <a href="https://github.com/paulshen/paul" className="underline">
            under construction
          </a>{" "}
          but check out the{" "}
          <Link href="/posts" className="underline">
            posts
          </Link>{" "}
          and{" "}
          <Link href="/projects" className="underline">
            projects
          </Link>{" "}
          in the meantime.
        </div>
      </div>
    </div>
  );
}
