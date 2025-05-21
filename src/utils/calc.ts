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
    const scrollOffset: number = window.scrollY;

    const initialHeight: number = containerRef?.current?.getBoundingClientRect().height as number;

    const shrinkContainer: HTMLElement | null = document.getElementById("shrink-container");
    const shrinkContainerHeight: number | undefined = shrinkContainer?.getBoundingClientRect()
        .height;

    const heightOfElementsBefore: number = Math.abs(
        (containerRef?.current?.getBoundingClientRect().top as number) -
            document.body.getBoundingClientRect().top
    );

    console.log("heightOfElementsBefore", heightOfElementsBefore);

    const leftoverHeight: number = initialHeight - (shrinkContainerHeight ?? 0);

    const activatorEvent: MouseEvent = event.activatorEvent;

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

    const mouseY: number = activatorEvent.clientY + scrollOffset - heightOfElementsBefore;

    console.log("mouseY", mouseY);

    const draggedElementTop: number = draggedElement?.getBoundingClientRect().top as number;

    const draggedElementParentTop: number = draggedElement?.parentElement?.getBoundingClientRect()
        .top as number;

    let realHeight: number = Math.abs(draggedElementTop - draggedElementParentTop);

    if (draggedElementTop < 0) {
        realHeight = Math.abs(draggedElementParentTop - draggedElementTop);
    }

    console.log("realHeight", realHeight);

    const shrinkElementTop: number = currentShrinkElement.getBoundingClientRect().top;

    const shrinkElementParentTop: number = currentShrinkElement?.parentElement?.getBoundingClientRect()
        .top as number;

    let shrinkHeight: number = Math.abs(shrinkElementTop - shrinkElementParentTop);

    if (shrinkElementTop < 0) {
        shrinkHeight = Math.abs(shrinkElementParentTop - shrinkElementTop);
    }

    console.log("shrinkHeight", shrinkHeight);

    const mouseYInRectangle: number = mouseY - realHeight;

    console.log("mouseYInRectangle", mouseYInRectangle);

    const ratio: number = mouseYInRectangle / draggedElementHeight;

    console.log("ratio", ratio);

    const handleAdjustment: number = topHandle
        ? mouseYInRectangle * (1 + ratio)
        : ratio * shrinkElementHeight;

    const topCompensation: number = mouseY - shrinkHeight - handleAdjustment;

    console.log("topCompensation", topCompensation);

    const bottomCompensation: number = leftoverHeight - topCompensation;

    return {
        top: topCompensation,
        bottom: bottomCompensation
    };
};
