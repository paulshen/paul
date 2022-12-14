import { BaseBlock, ExtendedRecordMap } from "notion-types";
import { NotionText } from "./NotionText";

export function renderNotionBlock(
  block: BaseBlock,
  recordMap: ExtendedRecordMap
) {
  switch (block.type) {
    case "text":
      if (block.properties === undefined) {
        return <div className="">&nbsp;</div>;
      }
      return (
        <div className="mb-4">
          <NotionText value={block.properties.title} recordMap={recordMap} />
        </div>
      );
    case "header":
    case "sub_header":
    case "sub_sub_header":
      return (
        <div className="text-xl mt-6 mb-2">
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

      const output =
        block.properties !== undefined ? (
          <li>
            <NotionText value={block.properties.title} recordMap={recordMap} />
          </li>
        ) : null;
      const isTopLevel =
        block.type !== recordMap.block[block.parent_id]?.value?.type;
      return isTopLevel ? wrapList(output) : output;
    }
    case "code": {
      return (
        <pre>
          <code>
            <NotionText value={block.properties?.title} recordMap={recordMap} />
          </code>
        </pre>
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
      if (!linkedBlock) {
        console.log('"alias" missing block', blockPointerId);
        return null;
      }
    }
    default:
      console.log(`unsupported: ${block.type}`);
      // console.log(block);
      return null;
  }
}
