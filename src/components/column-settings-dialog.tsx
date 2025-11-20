"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { ColumnConfig, SortDirection } from "@/hooks/use-column-config";

interface ColumnSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    columns: ColumnConfig[];
    onUpdateColumn: (id: string, updates: Partial<ColumnConfig>) => void;
    onToggleVisibility: (id: string) => void;
    onRenameColumn: (id: string, newLabel: string) => void;
    onReorderColumns: (newOrder: { id: string; order: number }[]) => void;
    onSetSortDirection: (id: string, direction: SortDirection) => void;
    onResetToDefaults: () => void;
}

function SortableColumnItem({
    column,
    onToggleVisibility,
    onRenameColumn,
    onSetSortDirection,
}: {
    column: ColumnConfig;
    onUpdateColumn: (id: string, updates: Partial<ColumnConfig>) => void;
    onToggleVisibility: (id: string) => void;
    onRenameColumn: (id: string, newLabel: string) => void;
    onSetSortDirection: (id: string, direction: SortDirection) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(column.label);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: column.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleSaveRename = () => {
        if (editValue.trim()) {
            onRenameColumn(column.id, editValue.trim());
        } else {
            setEditValue(column.label);
        }
        setIsEditing(false);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 rounded-lg border p-3 bg-card"
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            >
                <GripVertical className="h-4 w-4" />
            </div>

            <input
                type="checkbox"
                checked={column.visible}
                onChange={() => onToggleVisibility(column.id)}
                className="h-4 w-4 rounded border-gray-300"
            />

            <div className="flex-1">
                {isEditing ? (
                    <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSaveRename}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSaveRename();
                            } else if (e.key === "Escape") {
                                setEditValue(column.label);
                                setIsEditing(false);
                            }
                        }}
                        className="h-8"
                        autoFocus
                    />
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-left font-medium hover:underline"
                    >
                        {column.label}
                    </button>
                )}
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                        {column.sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                        ) : column.sortDirection === "desc" ? (
                            <ArrowDown className="h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onSetSortDirection(column.id, "asc")}>
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Sort Ascending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSetSortDirection(column.id, "desc")}>
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Sort Descending
                    </DropdownMenuItem>
                    {column.sortDirection !== null && (
                        <DropdownMenuItem onClick={() => onSetSortDirection(column.id, null)}>
                            <X className="h-4 w-4 mr-2" />
                            Clear Sort
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export function ColumnSettingsDialog({
    open,
    onOpenChange,
    columns,
    onUpdateColumn,
    onToggleVisibility,
    onRenameColumn,
    onReorderColumns,
    onSetSortDirection,
    onResetToDefaults,
}: ColumnSettingsDialogProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = columns.findIndex((col) => col.id === active.id);
            const newIndex = columns.findIndex((col) => col.id === over.id);

            const newColumns = arrayMove(columns, oldIndex, newIndex);
            const newOrder = newColumns.map((col, index) => ({
                id: col.id,
                order: index,
            }));

            onReorderColumns(newOrder);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Column Settings</DialogTitle>
                    <DialogDescription>
                        Drag to reorder, click to rename, and use the sort menu to sort columns.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={columns.map((col) => col.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2">
                                {columns.map((column) => (
                                    <SortableColumnItem
                                        key={column.id}
                                        column={column}
                                        onUpdateColumn={onUpdateColumn}
                                        onToggleVisibility={onToggleVisibility}
                                        onRenameColumn={onRenameColumn}
                                        onSetSortDirection={onSetSortDirection}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="outline" onClick={onResetToDefaults}>
                            Reset to Defaults
                        </Button>
                        <Button onClick={() => onOpenChange(false)}>Done</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

