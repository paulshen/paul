import { makeObservable, observable, runInAction, values } from "mobx";
import React from "react";

export type Pane = { id: string; content: React.ReactNode; z: number };

export const panesMobx = observable.map<string, Pane>([], { deep: false });

export function openPane(blockId: string, content: React.ReactNode) {
  runInAction(() => {
    const existingPanes = values(panesMobx);
    const newZ =
      existingPanes.length > 0
        ? Math.max(...values(panesMobx).map((pane) => pane.z)) + 1
        : 1;
    const pane = panesMobx.get(blockId);
    if (pane !== undefined) {
      pane.z = newZ;
    } else {
      panesMobx.set(
        blockId,
        makeObservable(
          {
            id: blockId,
            content,
            z: newZ,
          },
          { content: false, z: observable }
        )
      );
    }
  });
}
