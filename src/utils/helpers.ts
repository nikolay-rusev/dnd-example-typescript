import { TIMEOUT_SCROLL } from "./constants";

export const getActualElementHeight = (el: HTMLElement): number => {
    const style: CSSStyleDeclaration = window.getComputedStyle(el);
    const marginTop: number = parseFloat(style.marginTop);
    const marginBottom: number = parseFloat(style.marginBottom);
    return el.getBoundingClientRect().height + marginTop + marginBottom;
};

export const scrollAfterDragEnd = (id: string | number): void => {
    setTimeout(() => {
        document.querySelector(`[data-id=drag-item-${id}]`)?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, TIMEOUT_SCROLL);
};

export const getRandomInt = (max: number): number => Math.floor(Math.random() * max);