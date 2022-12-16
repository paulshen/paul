import { NotionAPI } from "notion-client";
import {
  BaseBlock,
  Collection,
  Decoration,
  ExtendedRecordMap,
  PageBlock,
} from "notion-types";
import { getDateValue } from "notion-utils";

type PostDatabaseItem = {
  id: string;
  Slug: string;
  Title: Decoration[];
  Date?: string;
  Publish?: boolean;
};

export type DatabaseItem = { id: string } & { [key: string]: any };

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function processDatabaseItem(
  page: PageBlock,
  collection: Collection
): DatabaseItem {
  const item: DatabaseItem = {
    id: page.id,
  };
  if (page.properties === undefined) {
    throw new Error(`missing properties`);
  }
  for (const [key, value] of Object.entries(page.properties)) {
    switch (collection.schema[key].type) {
      case "text":
      case "title":
        item[collection.schema[key].name] = value;
        break;
      case "date":
        const formattedDate = getDateValue(value);
        if (formattedDate?.type === "date") {
          const date = new Date(formattedDate.start_date);
          item[collection.schema[key].name] = `${
            MONTHS[date.getMonth()]
          } ${date.getFullYear()}`;
        }
        break;
      default:
        console.log(`unsupported schema type: ${collection.schema[key].type}`);
    }
  }
  // @ts-ignore
  return item;
}

const notion = new NotionAPI();
export async function getPostDatabase(): Promise<PostDatabaseItem[]> {
  const recordMap = await notion.getPage("d60770573fee487984f182b3a72fa803");
  const collection = Object.values(recordMap.collection)[0].value;
  // @ts-ignore
  return Object.values(recordMap.block)
    .map((block) => block.value)
    .filter((block): block is PageBlock => block?.type === "page")
    .map((pageBlock: PageBlock) => processDatabaseItem(pageBlock, collection));
}

export async function getPost(id: string): Promise<{
  post: PostDatabaseItem & { content: BaseBlock[] };
  recordMap: ExtendedRecordMap;
}> {
  const recordMap = await notion.getPage(id);
  const pageBlock = recordMap.block[id].value;
  const collection = Object.values(recordMap.collection)[0].value;
  if (pageBlock.type !== "page") {
    throw new Error();
  }
  const post = processDatabaseItem(pageBlock, collection);
  post.content =
    pageBlock.content?.map((childId) => recordMap.block[childId].value) ?? [];
  return {
    // @ts-ignore
    post,
    recordMap,
  };
}