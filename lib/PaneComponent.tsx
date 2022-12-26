"use client";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useDrag } from "@use-gesture/react";
import { action, autorun, observable, values } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { Pane, panesMobx } from "./AppState";

function PaneResizers({
  dimensionsMobx,
}: {
  dimensionsMobx: { width: number; height: number };
}) {
  const bindDrag = useDrag(
    action(({ movement, first, args, memo }) => {
      const [direction] = args;
      if (first) {
        return { ...dimensionsMobx };
      }
      if (direction.includes("right")) {
        dimensionsMobx.width = Math.max(memo.width + movement[0], 320);
      }
      if (direction.includes("bottom")) {
        dimensionsMobx.height = Math.max(memo.height + movement[1], 256);
      }
    })
  );

  return (
    <>
      <div
        {...bindDrag("right")}
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize touch-none group"
      >
        <div className="group-hover:opacity-20 opacity-0 absolute top-0 bottom-0 right-0 w-px bg-gray-800 transition" />
      </div>
      <div
        {...bindDrag("bottom")}
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize touch-none group"
      >
        <div className="group-hover:opacity-20 opacity-0 absolute bottom-0 left-0 right-0 h-px bg-gray-800 transition" />
      </div>
      <div
        {...bindDrag("bottom-right")}
        className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize touch-none group"
      ></div>
    </>
  );
}

export const PaneComponent = observer(
  ({ pane, children }: { pane: Pane; children: React.ReactNode }) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const [dimensionsMobx] = useState(() =>
      observable({
        width: Math.min(512, window.innerWidth - 128),
        height: Math.min(448, window.innerHeight - 64),
      })
    );
    const [positionMobx] = useState(() =>
      observable([window.innerWidth - dimensionsMobx.width - 32, 32])
    );
    const bindDrag = useDrag(
      action(({ movement, first, last, memo }) => {
        if (first) {
          headerRef.current!.style.cursor = "grabbing";
          return [...positionMobx];
        }
        positionMobx[0] = Math.floor(memo[0] + movement[0]);
        positionMobx[1] = Math.floor(memo[1] + movement[1]);
        if (last) {
          headerRef.current!.style.cursor = "";
        }
      })
    );
    useEffect(
      () =>
        autorun(() => {
          const rootElement = rootRef.current!;
          rootElement.style.transform = `translate(${Math.floor(
            positionMobx[0]
          )}px, ${Math.floor(positionMobx[1])}px)`;
        }),
      []
    );
    useEffect(
      () =>
        autorun(() => {
          const rootElement = rootRef.current!;
          rootElement.style.width = `${dimensionsMobx.width}px`;
          rootElement.style.height = `${dimensionsMobx.height}px`;
          rootElement.style.zIndex = `${pane.z}`;
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
        className="bg-white absolute left-0 top-0 flex flex-col shadow-lg rounded overflow-hidden"
        ref={rootRef}
      >
        <div
          {...bindDrag()}
          className="h-8 flex-shrink-0 bg-gray-700 touch-none cursor-grab flex items-center px-2"
          ref={headerRef}
        >
          <button
            onClick={action(() => {
              panesMobx.delete(pane.id);
            })}
            className="text-white opacity-80 hover:opacity-100"
          >
            <Cross2Icon />
          </button>
        </div>
        <div className="grow overflow-auto text-sm">{children}</div>
        <PaneResizers dimensionsMobx={dimensionsMobx} />
      </div>
    );
  }
);
