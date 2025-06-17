import {useEffect, useRef} from 'react';
import styles from './EndDropZone.module.css';
import {dropTargetForElements} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";

const EndDropZone = () => {
    const endDropRef = useRef<HTMLDivElement>(null);
    const {columns, setColumns} = useBoardContext()

    useEffect(() => {
        if (endDropRef.current) {
            return dropTargetForElements({
                element: endDropRef.current,
                canDrop: ({ source }) => source.data?.type === 'column',
                onDrop: ({ source }) => {
                    const { columnId } = source.data;
                    const draggedIndex = columns.findIndex((c) => c.id === columnId);
                    if (draggedIndex === -1) return;

                    const updated = [...columns];
                    const [moved] = updated.splice(draggedIndex, 1);
                    updated.push(moved);
                    setColumns(updated);
                },
            });
        }
    }, [columns, endDropRef]);

    return (
        <div id="end-drop-zone" className={styles.dropZoneEnd} ref={endDropRef}/>
    );
};

export default EndDropZone;