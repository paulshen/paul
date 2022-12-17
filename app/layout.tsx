import { PanesLayer } from "../lib/PanesLayer";
import { Sidebar } from "../lib/Sidebar";
import { getPostDatabase } from "./data";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getPostDatabase();

  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <div className="flex h-screen overflow-hidden">
          <Sidebar posts={posts} />
          <div className="grow overflow-y-auto">{children}</div>
        </div>
        <PanesLayer />
      </body>
    </html>
  );
}
