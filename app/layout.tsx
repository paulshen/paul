import { Inter, Roboto_Mono } from "@next/font/google";
import classNames from "classnames";
import { PanesLayer } from "../lib/PanesLayer";
import { Sidebar } from "../lib/Sidebar";
import { getPostDatabase, getProjectsDatabase } from "./data";
import "./globals.css";

const inter = Inter({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-inter",
});
const robotoMono = Roboto_Mono({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const revalidate = 60;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getPostDatabase();
  const projects = await getProjectsDatabase();

  return (
    <html lang="en" className={classNames(inter.variable, robotoMono.variable)}>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <div className="flex overflow-hidden">
          <Sidebar posts={posts} projects={projects} />
          <div className="grow max-h-screen overflow-y-auto">{children}</div>
        </div>
        <PanesLayer />
      </body>
    </html>
  );
}
