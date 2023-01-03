import { BaseBlock, ExtendedRecordMap } from "notion-types";
import React from "react";
import { processDatabaseItem } from "../app/data";
import { Exercise } from "./Exercise";
import { HighlightedCode } from "./HighlightedCode";
import { NotionText } from "./NotionText";
import { textDecorationsToString } from "./NotionUtils";
import { TweetEmbed } from "./TweetEmbed";

function BlockIcon({ block }: { block: BaseBlock }) {
  const pageIcon: string | undefined = block.format?.page_icon;
  if (pageIcon === undefined) {
    return null;
  }

  return <div>{pageIcon}</div>;
}

// https://github.com/NotionX/react-notion-x/blob/3aef81f18d79dfa5c86a27bf3934d13c77664323/packages/react-notion-x/src/utils.ts#L66
const youtubeDomains = new Set([
  "youtu.be",
  "youtube.com",
  "www.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);
export const getYoutubeId = (url: string): string | null => {
  try {
    const { hostname } = new URL(url);
    if (!youtubeDomains.has(hostname)) {
      return null;
    }
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/i;

    const match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    }
  } catch {
    // ignore invalid urls
  }
  return null;
};

function BlockRenderer({
  block,
  recordMap,
  children,
}: {
  block: BaseBlock;
  recordMap: ExtendedRecordMap;
  children: React.ReactNode;
}) {
  switch (block.type) {
    case "page": {
      return (
        <div className="text-neutral-900 text-sm leading-relaxed">
          {block.content?.map((blockId) => (
            <NotionBlock
              blockId={blockId}
              recordMap={recordMap}
              key={blockId}
            />
          ))}
        </div>
      );
    }
    case "text":
      if (block.properties === undefined) {
        return <div className=""> </div>;
      }
      return (
        <div className="whitespace-pre-wrap my-4">
          <NotionText value={block.properties.title} recordMap={recordMap} />
        </div>
      );
    case "header":
    case "sub_header":
    case "sub_sub_header":
      return (
        <div className="text-xl font-semibold mt-6 mb-2">
          <NotionText value={block.properties.title} recordMap={recordMap} />
        </div>
      );
    case "image":
      return (
        <img
          src={`https://www.notion.so/image/${encodeURIComponent(
            block.properties.source[0][0]
          )}?table=block&id=${block.id}`}
        />
      );
    case "bulleted_list": {
      const wrapList = (content: React.ReactNode, start?: number) =>
        block.type === "bulleted_list" ? (
          <ul className="list-disc pl-6">{content}</ul>
        ) : (
          <ol start={start}>{content}</ol>
        );

      let output =
        block.properties !== undefined ? (
          <li className="py-px">
            <NotionText value={block.properties.title} recordMap={recordMap} />
          </li>
        ) : null;
      if (block.content !== undefined) {
        output = (
          <>
            {output}
            {wrapList(children)}
          </>
        );
      }
      const isTopLevel =
        block.type !== recordMap.block[block.parent_id]?.value?.type;
      return isTopLevel ? wrapList(output) : output;
    }
    case "code": {
      return (
        <div className="-mx-2 md:-mx-4 my-6">
          <HighlightedCode
            language={textDecorationsToString(
              block.properties.language
            ).toLowerCase()}
            code={textDecorationsToString(block.properties.title)}
          />
        </div>
      );
    }
    case "toggle": {
      if (block.properties?.title[0][0] === "Ignore") {
        return null;
      }
      return (
        <div>
          <div>toggle</div>
          <NotionText value={block.properties?.title} recordMap={recordMap} />
        </div>
      );
    }
    case "alias": {
      const blockPointerId = block?.format?.alias_pointer?.id;
      const linkedBlock = recordMap.block[blockPointerId]?.value;
      if (linkedBlock === undefined) {
        console.log('"alias" missing block', blockPointerId);
        return null;
      }
      const collection = recordMap.collection[linkedBlock.parent_id]?.value;
      if (collection !== undefined) {
        if (collection.name[0][0] === "Exercises") {
          if (linkedBlock.type !== "page") {
            throw new Error();
          }
          const item: any = processDatabaseItem(linkedBlock, collection);
          return (
            <Exercise
              blockId={blockPointerId}
              prompt={<NotionText value={item.Prompt} recordMap={recordMap} />}
              exerciseCode={textDecorationsToString(item.Exercise)}
              solutionCode={
                <HighlightedCode
                  code={textDecorationsToString(item.Solution)}
                  language="typescript"
                />
              }
            />
          );
        }
      }
      return <div>alias {blockPointerId}</div>;
    }
    case "callout": {
      return (
        <div className="bg-neutral-100 p-4 flex gap-4 items-start rounded">
          <BlockIcon block={block} />
          <NotionText value={block.properties?.title} recordMap={recordMap} />
          {children}
        </div>
      );
    }
    case "quote": {
      return (
        <div className="bg-neutral-100 p-4">
          <NotionText value={block.properties?.title} recordMap={recordMap} />
        </div>
      );
    }
    case "tweet": {
      const source =
        recordMap.signed_urls?.[block.id] ?? block.properties?.source?.[0]?.[0];
      const id = source.split("?")[0].split("/").pop();
      if (id === undefined) {
        return null;
      }
      return (
        <div className="my-4">
          <TweetEmbed tweetId={id} />
        </div>
      );
    }
    case "video": {
      const source =
        recordMap.signed_urls?.[block.id] ?? block.properties?.source?.[0]?.[0];
      const youtubeVideoId = getYoutubeId(source);
      if (youtubeVideoId !== null) {
        return (
          <div className="my-4">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={true}
              className="w-full aspect-video"
            ></iframe>
          </div>
        );
      }
      return (
        <div className="my-4">
          <video src={source} controls={true} playsInline={true} />
        </div>
      );
    }
    default:
      console.log(`unsupported: ${block.type}`);

      // console.log(block);

      return null;
  }
}

export function NotionBlock({
  blockId,
  recordMap,
}: {
  blockId: string;
  recordMap: ExtendedRecordMap;
}) {
  const block = recordMap.block[blockId]?.value;
  return (
    <BlockRenderer block={block} recordMap={recordMap}>
      {block.content?.map((childBlockId) => {
        return (
          <NotionBlock
            blockId={childBlockId}
            recordMap={recordMap}
            key={childBlockId}
          />
        );
      })}
    </BlockRenderer>
  );
}
