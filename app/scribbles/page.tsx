import Image from "next/image";
import { getScribblesDatabase } from "../data";

export default async function ScribblesPage() {
  const scribbles = await getScribblesDatabase();

  return (
    <div className="px-8 py-8 grid grid-cols-3 max-lg:grid-cols-2 gap-2">
      {scribbles.map((scribble) => (
        <div className="aspect-square relative" key={scribble.id}>
          <Image
            src={`https://www.notion.so/image/${encodeURIComponent(
              // @ts-ignore
              scribble.Image
            )}?table=block&id=${scribble.id}`}
            alt="drawing"
            fill={true}
          ></Image>
        </div>
      ))}
    </div>
  );
}
