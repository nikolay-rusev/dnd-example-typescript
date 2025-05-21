import React, { useRef, useState, FC } from "react";
import { DndContext, DragOverlay, MeasuringStrategy, pointerWithin } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
    OUTER_CONTENT_HEIGHT,
    shrinkContainerStyle,
    TIMEOUT,
    TRANSITION
} from "../utils/constants";
import { scrollAfterDragEnd } from "../utils/helpers";
import { calculateFillHeights } from "../utils/calc";
import { SortableItem } from "./SortableItem";
import "./DragNDrop.css";

const topHandle: boolean = true;
const allowBottomCompensation: boolean = true;
const itemsArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const DragNDrop: FC = () => {
    const [items, setItems] = useState<number[]>(itemsArray);
    const [activeId, setActiveId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [topFillHeight, setTopFillHeight] = useState<number>(0);
    const [bottomFillHeight, setBottomFillHeight] = useState<number>(0);

    const handleDragStart = (event: any): void => {
        if (!containerRef.current) return;

        const scrollOffset: number = window.scrollY;
        console.log("scrollOffset", scrollOffset);

        const { top, bottom } = calculateFillHeights({ event, containerRef, topHandle });

        setTopFillHeight(top);
        setBottomFillHeight(bottom);
        console.log("before adjust scrollOffset", scrollOffset);
        console.log("----------------------------------------------------------------------");
        window.scrollTo({ top: scrollOffset });

        setActiveId(event.active.id as number);
    };

    const handleDragEnd = (event: any): void => {
        const { active, over } = event;

        const activeId: string = active.id;

        setActiveId(null);

        setTimeout(() => {
            setTopFillHeight(0);
            setBottomFillHeight(0);
        }, TIMEOUT);

        if (over) {
            setItems((prev) =>
                arrayMove(prev, prev.indexOf(Number(activeId)), prev.indexOf(over.id))
            );
            scrollAfterDragEnd(activeId);
        }
    };

    const getDraggableItems = ({
        activeId,
        items,
        dummy
    }: {
        activeId: number | null;
        items: number[];
        dummy?: boolean;
    }) => {
        return (
            <>
                <SortableContext items={items}>
                    {items.map((id: number, index: number) => (
                        <SortableItem
                            id={id}
                            activeId={activeId}
                            key={id}
                            dummy={dummy}
                            last={index === items.length - 1}
                        />
                    ))}
                </SortableContext>
                <DragOverlay modifiers={[]}>
                    {activeId ? (
                        <SortableItem
                            id={activeId}
                            activeId={activeId}
                            className={"drag-overlay"}
                        />
                    ) : null}
                </DragOverlay>
            </>
        );
    };

    const children = getDraggableItems({ activeId, items });
    const dummyChildren = getDraggableItems({ activeId, items, dummy: true });

    return (
        <>
            <div
                style={{
                    height: OUTER_CONTENT_HEIGHT,
                    backgroundColor: "mediumaquamarine"
                }}
            ></div>
            <div className="dnd-container" ref={containerRef} style={{ position: "relative" }}>
                <div
                    className="top-fill"
                    style={{ transition: TRANSITION, height: topFillHeight }}
                ></div>
                <div id="dnd-context-container" className="dnd-context-container">
                    <div
                        id="actual-container"
                        className="actual-container"
                        style={{ position: "relative" }}
                    >
                        <DndContext
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            collisionDetection={pointerWithin}
                            autoScroll={{ layoutShiftCompensation: false }}
                            measuring={{
                                droppable: {
                                    strategy: MeasuringStrategy.WhileDragging
                                }
                            }}
                        >
                            {children}
                        </DndContext>
                    </div>
                    <div id="shrink-container" style={shrinkContainerStyle}>
                        {dummyChildren}
                    </div>
                </div>
                {allowBottomCompensation && (
                    <div
                        className="bottom-fill"
                        style={{ transition: TRANSITION, height: bottomFillHeight }}
                    ></div>
                )}
            </div>

            <div
                style={{
                    height: OUTER_CONTENT_HEIGHT,
                    backgroundColor: "mediumaquamarine"
                }}
            ></div>
        </>
    );
};

export default DragNDrop;
