import React, { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import {
    defaultItemStyle,
    dragHandleStyle,
    dummyItemStyle,
    REGULAR_HEIGHT,
    SHRUNK_HEIGHT
} from "../utils/constants";
import { getRandomInt } from "../utils/helpers";

interface CalcItemStyleProps {
    activeId: number | null;
    transform: { x?: number; y?: number } | null;
    randomizeHeight?: boolean;
    last?: boolean;
}

export const calcItemStyle = ({
    activeId,
    transform,
    randomizeHeight,
    last
}: CalcItemStyleProps): CSSProperties => {
    const regularHeight = randomizeHeight ? REGULAR_HEIGHT + getRandomInt(300) : REGULAR_HEIGHT;
    const itemHeight = activeId ? SHRUNK_HEIGHT : regularHeight;

    return {
        ...defaultItemStyle,
        height: itemHeight,
        transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
        marginBottom: last ? 0 : 8
    };
};

interface SortableItemProps {
    id: number;
    activeId: number | null;
    dummy?: boolean;
    last?: boolean;
    className?: string;
    randomizeHeight?: boolean;
}

export const SortableItem: React.FC<SortableItemProps> = ({
    id,
    activeId,
    dummy,
    last,
    className,
    randomizeHeight
}) => {
    const { attributes, setNodeRef, transform, listeners } = useSortable({ id });

    // last item has no bottom margin
    const itemStyle = dummy
        ? dummyItemStyle
        : calcItemStyle({ activeId, transform, randomizeHeight, last });

    // put ids in actual elements for easier detection
    const dragItemId = dummy ? null : `drag-item-${id}`;

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            style={itemStyle}
            data-id={dragItemId}
            data-index={id}
            className={className}
        >
            <div {...listeners} className={"drag-handle"} style={dragHandleStyle}>
                ☰
            </div>
            {id}
        </div>
    );
};
