import classNames from "classnames";
import { Decoration, ExtendedRecordMap } from "notion-types";
import { formatDate } from "notion-utils";
import React from "react";
import { NotionBlock } from "./NotionBlock";
import { NotionTextAnchor } from "./NotionTextAnchor";
import { textDecorationsToString } from "./NotionUtils";

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
        if (decorations === undefined) {
          if (text === ",") {
            return <span className="p-0.5" key={index} />;
          } else {
            return (
              <React.Fragment key={index}>
                {text.replaceAll(/ /g, " ")}
              </React.Fragment>
            );
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
                return <code className="bg-gray-100 font-mono">{element}</code>;

              case "b":
                return <b className="font-semibold">{element}</b>;

              case "i":
                return <em className="italic">{element}</em>;

              case "s":
                return <s>{element}</s>;

              case "_":
                return <span className="">{element}</span>;

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
                  const linkedBlock =
                    recordMap.block[addDashesToUUID(v.slice(1))].value;
                  return (
                    <NotionTextAnchor
                      blockId={linkedBlock.id}
                      paneContent={
                        <div className="px-4 py-2 sm:px-8 sm:py-4">
                          <div className="text-xl font-semibold mb-4">
                            {textDecorationsToString(
                              linkedBlock.properties.title
                            )}
                          </div>
                          <NotionBlock
                            blockId={linkedBlock.id}
                            recordMap={recordMap}
                          />
                        </div>
                      }
                    >
                      {element}
                    </NotionTextAnchor>
                  );
                }
                return (
                  <a
                    href={v}
                    className={classNames(
                      typeof element === "object" &&
                        element != null &&
                        "props" in element &&
                        typeof element.props.children === "string" &&
                        element.props.children.trim().endsWith("->")
                        ? "hover:underline"
                        : "underline"
                    )}
                  >
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
          <>{text.replaceAll("→", "->")}</>
        );

        return <React.Fragment key={index}>{formatted}</React.Fragment>;
      })}
    </>
  );
}
