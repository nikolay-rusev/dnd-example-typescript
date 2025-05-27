import { RefObject } from "react";
import { getActualElementHeight } from "./helpers";

interface CalculateFillHeightsProps {
    event: {
        activatorEvent: MouseEvent;
    };
    containerRef: RefObject<HTMLDivElement | null>;
    topHandle: boolean;
}

export const calculateFillHeights = ({
    event,
    containerRef,
    topHandle
}: CalculateFillHeightsProps): { top: number; bottom: number } => {
    // scroll offset Y
    const scrollOffset: number = window.scrollY;

    // Capture the original container height
    const initialHeight: number = containerRef?.current?.getBoundingClientRect().height as number;

    // shrunk container height
    const shrinkContainer: HTMLElement | null = document.getElementById("shrink-container");
    const shrinkContainerHeight: number | undefined = shrinkContainer?.getBoundingClientRect()
        .height;

    // calculate size of elements on top of drag container
    const heightOfElementsBefore: number = Math.abs(
        (containerRef?.current?.getBoundingClientRect().top as number) -
            document.body.getBoundingClientRect().top
    );

    console.log("heightOfElementsBefore", heightOfElementsBefore);

    // Calculate remaining space after shrink has happened
    const leftoverHeight: number = initialHeight - (shrinkContainerHeight ?? 0);

    const activatorEvent: MouseEvent = event.activatorEvent;

    // get element for drag-handle case
    const dragHandle: HTMLElement = activatorEvent?.srcElement as HTMLElement;
    const draggedElement: HTMLElement | null | undefined = dragHandle?.parentElement;
    const currentIndex: number = parseInt(draggedElement?.getAttribute("data-index") ?? "0");
    const currentShrinkElement: HTMLElement = document.querySelector(
        `#shrink-container [data-index="${currentIndex}"]`
    ) as HTMLElement;

    const shrinkElementHeight: number = getActualElementHeight(currentShrinkElement);
    console.log("shrinkElementHeight", shrinkElementHeight);
    const draggedElementHeight: number = getActualElementHeight(draggedElement as HTMLElement);
    console.log("draggedElementHeight", draggedElementHeight);

    // remove height of the elements before the drag container from mouse y, adjust with scrollOffset also
    const mouseY: number = activatorEvent.clientY + scrollOffset - heightOfElementsBefore;
    console.log("mouseY", mouseY);

    const draggedElementTop: number = draggedElement?.getBoundingClientRect().top as number;
    const draggedElementParentTop: number = draggedElement?.parentElement?.getBoundingClientRect()
        .top as number;
    // distance from top of drag container to the top of dragged element
    let realHeight: number = Math.abs(draggedElementTop - draggedElementParentTop);
    if (draggedElementTop < 0) {
        realHeight = Math.abs(draggedElementParentTop - draggedElementTop);
    }
    console.log("realHeight", realHeight);

    const shrinkElementTop: number = currentShrinkElement.getBoundingClientRect().top;
    const shrinkElementParentTop: number = currentShrinkElement?.parentElement?.getBoundingClientRect()
        .top as number;
    // distance from top of shrink container to the top of shrink element
    let shrinkHeight: number = Math.abs(shrinkElementTop - shrinkElementParentTop);
    if (shrinkElementTop < 0) {
        shrinkHeight = Math.abs(shrinkElementParentTop - shrinkElementTop);
    }
    console.log("shrinkHeight", shrinkHeight);

    // mouse distance from top of dragged element to mouse point in dragged element
    const mouseYInRectangle: number = mouseY - realHeight;
    console.log("mouseYInRectangle", mouseYInRectangle);

    // radio for calculating the mouse point in shrunk element
    const ratio: number = mouseYInRectangle / draggedElementHeight;
    console.log("ratio", ratio);

    // hypothetical mouse distance from top of shrink element to mouse point in shrink element
    // depend on the position of the handle
    const handleAdjustment: number = topHandle
        ? mouseYInRectangle * (1 + ratio)
        : ratio * shrinkElementHeight;
    const topCompensation: number = realHeight + mouseYInRectangle - (shrinkHeight + handleAdjustment);
    console.log("topCompensation", topCompensation);

    // easy
    const bottomCompensation: number = leftoverHeight - topCompensation;

    return {
        top: topCompensation,
        bottom: bottomCompensation
    };
};
