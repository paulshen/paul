"use client";
import { useDrag } from "@use-gesture/react";
import { action, autorun, values } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { Pane, panesMobx } from "./AppState";

export const PaneComponent = observer(
  ({ pane, children }: { pane: Pane; children: React.ReactNode }) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const bindDrag = useDrag(({ offset }) => {
      rootRef.current!.style.transform = `translate(${Math.floor(
        offset[0]
      )}px, ${Math.floor(offset[1])}px)`;
    });
    useEffect(
      () =>
        autorun(() => {
          rootRef.current!.style.zIndex = `${pane.z}`;
        }),
      []
    );

    return (
      <div
        onMouseDown={action(() => {
          const existingPanes = values(panesMobx);
          pane.z =
            existingPanes.length > 0
              ? Math.max(...values(panesMobx).map((pane) => pane.z)) + 1
              : 1;
        })}
        className="bg-white absolute w-[32rem] h-96 flex flex-col shadow-lg rounded overflow-hidden"
        ref={rootRef}
      >
        <div {...bindDrag()} className="h-6 flex-shrink-0 bg-black touch-none">
          <button
            onClick={action(() => {
              panesMobx.delete(pane.id);
            })}
            className="text-white text-xs"
          >
            close
          </button>
        </div>
        <div className="grow overflow-auto text-sm">{children}</div>
      </div>
    );
  }
);
