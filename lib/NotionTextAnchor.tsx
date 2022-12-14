"use client";
import React from "react";

export function NotionTextAnchor({
  linkedBlock,
  children,
}: {
  linkedBlock: any;
  children: React.ReactNode;
}) {
  return (
    <a
      href={linkedBlock.id}
      onClick={(e) => {
        console.log(linkedBlock);
        e.preventDefault();
      }}
      className="underline"
    >
      {children}
    </a>
  );
}
