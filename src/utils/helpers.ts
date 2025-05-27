import { TIMEOUT_SCROLL_AFTER_DRAG_END } from "./constants";

// calc element height + margins
export const getActualElementHeight = (el: HTMLElement): number => {
    const style: CSSStyleDeclaration = window.getComputedStyle(el);
    const marginTop: number = parseFloat(style.marginTop);
    const marginBottom: number = parseFloat(style.marginBottom);
    return el.getBoundingClientRect().height + marginTop + marginBottom;
};

export const scrollAfterDragEnd = (id: string | number): void => {
    // Scroll to the final position
    setTimeout(() => {
        document.querySelector(`[data-id=drag-item-${id}]`)?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, TIMEOUT_SCROLL_AFTER_DRAG_END);
};

export const restoreScrollPosition = (scrollOffset: number) => {
    console.log("before restore scroll position", scrollOffset);
    console.log("----------------------------------------------------------------------");
    window.scrollTo({ top: scrollOffset });
};

export const getRandomInt = (max: number): number => Math.floor(Math.random() * max);
