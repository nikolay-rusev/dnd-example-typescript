export const TIMEOUT: number = 0;
export const TIMEOUT_SCROLL: number = 200;
export const REGULAR_WIDTH: number = 300;
export const REGULAR_HEIGHT: number = 100;
export const SHRUNK_HEIGHT: number = 40;
export const OUTER_CONTENT_HEIGHT: number = 450;
export const TRANSITION: string = "all 0.4s ease";

export interface Style {
    visibility?: string;
    position?: string;
    top?: number;
    right?: number;
    width?: string;
    cursor?: string;
    padding?: string;
    background?: string;
    color?: string;
    borderRadius?: string;
    marginBottom?: number;
    display?: string;
    flexDirection?: string;
    alignItems?: string;
    justifyContent?: string;
    transition?: string;
    height?: number;
}

export const shrinkContainerStyle: Style = {
    visibility: "hidden",
    position: "absolute",
    top: 0,
    right: 0
};

export const dragHandleStyle: Style = {
    width: "100%",
    cursor: "grab",
    padding: "1px",
    background: "darkblue",
    color: "white",
    borderRadius: "1px"
};

// default sortable item style
export const defaultItemStyle: Style = {
    marginBottom: 8,
    background: "lightblue",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between", // Adjusted for drag handle placement
    //@ts-ignore
    padding: 5,
    transition: TRANSITION,
    //@ts-ignore
    width: REGULAR_WIDTH,
    height: REGULAR_HEIGHT,
    transform: `translate(0, 0)`
};

// default shrink item style
export const dummyItemStyle: Style = {
    ...defaultItemStyle,
    height: SHRUNK_HEIGHT
};
