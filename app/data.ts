import { NotionAPI } from "notion-client";
import {
  BaseBlock,
  ExtendedRecordMap,
  PageBlock,
  Collection,
} from "notion-types";

type PostDatabaseItem = {
  id: string;
  Slug: string;
  Title: string;
  Date?: string;
  Publish?: boolean;
};

type PostItem = {
  id: string;
  content: BaseBlock[];
};

function processDatabaseItem(
  page: PageBlock,
  collection: Collection
): PostDatabaseItem {
  const item: Partial<PostDatabaseItem> = {
    id: page.id,
  };
  if (page.properties === undefined) {
    throw new Error(`unexpected missing properties`);
  }
  for (const [key, value] of Object.entries(page.properties)) {
    switch (collection.schema[key].type) {
      case "text":
      case "title":
        // @ts-ignore
        item[collection.schema[key].name] = value;
        break;
    }
  }
  // @ts-ignore
  return item;
}

const notion = new NotionAPI();
export async function getPostDatabase(): Promise<PostDatabaseItem[]> {
  const recordMap = await notion.getPage("d60770573fee487984f182b3a72fa803");
  const collection = Object.values(recordMap.collection)[0].value;
  return Object.values(recordMap.block)
    .map((block) => block.value)
    .filter((block): block is PageBlock => block?.type === "page")
    .map((pageBlock: PageBlock) => processDatabaseItem(pageBlock, collection));
}

export async function getPost(
  id: string
): Promise<{ post: PostItem; recordMap: ExtendedRecordMap }> {
  const recordMap = await notion.getPage(id);
  const pageBlock = recordMap.block[id].value;
  const content =
    pageBlock.content?.map((childId) => recordMap.block[childId].value) ?? [];
  return {
    post: {
      id: pageBlock.id,
      content,
    },
    recordMap,
  };
}
