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
    let fromContainerTopToElementTop: number = Math.abs(
        draggedElementTop - draggedElementParentTop
    );
    if (draggedElementTop < 0) {
        fromContainerTopToElementTop = Math.abs(draggedElementParentTop - draggedElementTop);
    }
    console.log("fromContainerTopToElementTop", fromContainerTopToElementTop);

    const shrinkElementTop: number = currentShrinkElement.getBoundingClientRect().top;
    const shrinkElementParentTop: number = currentShrinkElement?.parentElement?.getBoundingClientRect()
        .top as number;
    // distance from top of shrink container to the top of shrink element
    let fromContainerTopToElementTopShrink: number = Math.abs(
        shrinkElementTop - shrinkElementParentTop
    );
    if (shrinkElementTop < 0) {
        fromContainerTopToElementTopShrink = Math.abs(shrinkElementParentTop - shrinkElementTop);
    }
    console.log("fromContainerTopToElementTopShrink", fromContainerTopToElementTopShrink);

    // mouse distance from top of dragged element to mouse point in dragged element
    const mouseYInRectangle: number = mouseY - fromContainerTopToElementTop;
    console.log("mouseYInRectangle", mouseYInRectangle);

    // radio for calculating the mouse point in shrunk element
    const ratio: number = mouseYInRectangle / draggedElementHeight;
    console.log("ratio", ratio);

    // hypothetical mouse distance from top of shrink element to mouse point in shrink element
    // depends on the position of the handle
    const mouseYInRectangleShrink: number = topHandle
        ? mouseYInRectangle * (1 + ratio)
        : ratio * shrinkElementHeight;
    const topCompensation: number =
        fromContainerTopToElementTop +
        mouseYInRectangle -
        (fromContainerTopToElementTopShrink + mouseYInRectangleShrink);
    console.log("topCompensation", topCompensation);

    // easy
    const bottomCompensation: number = leftoverHeight - topCompensation;
    console.log("bottomCompensation", bottomCompensation);

    // needed for no bottom compensation
    const realMouseY: number = activatorEvent.clientY;
    console.log("realMouseY", realMouseY);
    const documentBottom: number = document.body.getBoundingClientRect().bottom;
    console.log("documentBottom", documentBottom);
    const windowBottom: number = window.innerHeight;
    console.log("windowBottom", windowBottom);
    const fromMouseYToWindowBottom = windowBottom - realMouseY;
    console.log("fromMouseYToWindowBottom", fromMouseYToWindowBottom);
    const fromMouseYToDocumentBottom = documentBottom - realMouseY;
    console.log("fromMouseYToDocumentBottom", fromMouseYToDocumentBottom);
    const leftoverBottomSpace = fromMouseYToDocumentBottom - fromMouseYToWindowBottom;
    console.log("leftoverBottomSpace", leftoverBottomSpace);

    let bottom: number = 0;
    // we cannot skip compensation, because we don't have enough space
    if (leftoverBottomSpace < bottomCompensation) {
        bottom = bottomCompensation;
    }

    return {
        top: topCompensation,
        bottom
    };
};
