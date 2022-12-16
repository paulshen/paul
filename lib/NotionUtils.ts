import { Decoration } from "notion-types";

export function textDecorationsToString(decorations: Decoration[]): string {
  return decorations.map((decoration) => decoration[0]).join("");
}
