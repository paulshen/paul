"use client";
import React from "react";
import { openPane } from "./AppState";

export function NotionTextAnchor({
  blockId,
  paneContent,
  children,
}: {
  blockId: string;
  paneContent: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <a
      href={blockId}
      onClick={(e) => {
        openPane(blockId, paneContent);
        e.preventDefault();
      }}
      className="underline decoration-dashed decoration-1 decoration-gray-600 underline-offset-2 hover:decoration-gray-700"
    >
      {children}
    </a>
  );
}
