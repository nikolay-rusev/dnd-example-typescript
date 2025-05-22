import { CSSProperties } from "react";

// timeout for reset of compensations
export const RESET_TIMEOUT: number = 0;

// scroll timeout after drag end should be >= from the transition time,
// so that the transition has completed before scroll is initiated
export const TIMEOUT_SCROLL_AFTER_DRAG_END: number = 400;
export const TRANSITION: string = "all 0.4s ease";

export const REGULAR_WIDTH: number = 300;
export const REGULAR_HEIGHT: number = 100;
export const SHRUNK_HEIGHT: number = 40;

// simulate outer content
export const OUTER_CONTENT_HEIGHT: number = 450;

export const shrinkContainerStyle: CSSProperties = {
    visibility: "hidden",
    position: "absolute",
    top: 0,
    right: 0
};

export const dragHandleStyle: CSSProperties = {
    width: "100%",
    cursor: "grab",
    padding: "1px",
    background: "darkblue",
    color: "white",
    borderRadius: "1px"
};

// default sortable item style
export const defaultItemStyle: CSSProperties = {
    marginBottom: 8,
    background: "lightblue",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between", // Adjusted for drag handle placement
    padding: 5,
    transition: TRANSITION,
    width: REGULAR_WIDTH,
    height: REGULAR_HEIGHT,
    transform: `translate(0, 0)`
};

// default shrink item style
export const dummyItemStyle: CSSProperties = {
    ...defaultItemStyle,
    height: SHRUNK_HEIGHT
};
