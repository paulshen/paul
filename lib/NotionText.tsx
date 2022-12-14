import React from "react";
import { Decoration, ExtendedRecordMap } from "notion-types";
import { formatDate } from "notion-utils";
import { NotionTextAnchor } from "./NotionTextAnchor";

function addDashesToUUID(uuid: string) {
  return uuid
    .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5")
    .toLowerCase();
}

export function NotionText({
  value,
  recordMap,
}: {
  value: Decoration[] | undefined;
  recordMap: ExtendedRecordMap;
}) {
  return (
    <>
      {value?.map(([text, decorations], index) => {
        if (!decorations) {
          if (text === ",") {
            return <span key={index} style={{ padding: "0.5em" }} />;
          } else {
            return <React.Fragment key={index}>{text}</React.Fragment>;
          }
        }

        const formatted = decorations.reduce(
          (element: React.ReactNode, decorator) => {
            switch (decorator[0]) {
              case "h":
                return (
                  <span className={`notion-${decorator[1]}`}>{element}</span>
                );

              case "c":
                return <code className="notion-inline-code">{element}</code>;

              case "b":
                return <b>{element}</b>;

              case "i":
                return <em>{element}</em>;

              case "s":
                return <s>{element}</s>;

              case "_":
                return (
                  <span className="notion-inline-underscore">{element}</span>
                );

              case "m":
                // comment / discussion
                return element; //still need to return the base element

              case "d": {
                const v = decorator[1];
                const type = v?.type;

                if (type === "date") {
                  // Example: Jul 31, 2010
                  const startDate = v.start_date;

                  return formatDate(startDate);
                } else if (type === "daterange") {
                  const startDate = v.start_date;
                  const endDate = v.end_date!;

                  return `${formatDate(startDate)} → ${formatDate(endDate)}`;
                } else {
                  return element;
                }
              }

              case "a": {
                const v = decorator[1];
                if (v.startsWith("/")) {
                  return (
                    <NotionTextAnchor
                      linkedBlock={recordMap.block[addDashesToUUID(v.slice(1))]}
                    >
                      {element}
                    </NotionTextAnchor>
                  );
                }
                return (
                  <a href={v} className="underline">
                    {element}
                  </a>
                );
              }

              default:
                if (process.env.NODE_ENV !== "production") {
                  console.log("unsupported text format", decorator);
                }
                return element;
            }
          },
          <>{text}</>
        );

        return <React.Fragment key={index}>{formatted}</React.Fragment>;
      })}
    </>
  );
}
