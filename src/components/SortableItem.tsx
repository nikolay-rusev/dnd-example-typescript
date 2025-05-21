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
    last?: boolean;
}

export const calcItemStyle = ({ activeId, transform, last }: CalcItemStyleProps): CSSProperties => {
    return {
        ...defaultItemStyle,
        height: activeId ? SHRUNK_HEIGHT : REGULAR_HEIGHT + getRandomInt(300),
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
}

export const SortableItem: React.FC<SortableItemProps> = ({
    id,
    activeId,
    dummy,
    last,
    className
}) => {
    const { attributes, setNodeRef, transform, listeners } = useSortable({ id });

    const itemStyle = dummy ? dummyItemStyle : calcItemStyle({ activeId, transform, last });

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
