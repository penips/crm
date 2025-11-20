"use client";

import { memo, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DealCard } from "./deal-card";
import { cn } from "~/lib/utils";

interface KanbanColumnProps {
    id: string;
    title: string;
    deals: Array<{
        id: string;
        name: string;
        stage: string;
        value: string | null;
        currency: string | null;
        dealContacts?: Array<{
            contact: {
                id: string;
                firstName: string | null;
                lastName: string | null;
                email: string | null;
                company: string | null;
            };
        }>;
        expectedCloseDate: Date | null;
    }>;
    dealCount: number;
}

export const KanbanColumn = memo(function KanbanColumn({
    id,
    title,
    deals,
    dealCount,
}: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    const dealIds = useMemo(
        () => deals.map((deal) => deal.id),
        [deals],
    );

    return (
        <div className="flex min-w-[300px] flex-col">
            <Card
                className={cn(
                    "flex-1 transition-colors",
                    isOver && "ring-2 ring-primary ring-offset-2 bg-primary/5",
                )}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                        <Badge variant="secondary">{dealCount}</Badge>
                    </div>
                </CardHeader>
                <CardContent
                    ref={setNodeRef}
                    className="flex-1 space-y-2 overflow-y-auto min-h-[400px]"
                >
                    {deals.length === 0 ? (
                        <div
                            className={cn(
                                "flex items-center justify-center h-full min-h-[350px] rounded-lg border-2 border-dashed transition-colors",
                                isOver
                                    ? "border-primary bg-primary/10"
                                    : "border-muted-foreground/20",
                            )}
                        >
                            <div className="text-center">
                                <p className="text-sm font-medium text-muted-foreground">
                                    {isOver ? "Drop here" : "No deals"}
                                </p>
                                {!isOver && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Drag deals here
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <SortableContext
                            items={dealIds}
                            strategy={verticalListSortingStrategy}
                        >
                            {deals.map((deal) => (
                                <DealCard key={deal.id} deal={deal} />
                            ))}
                        </SortableContext>
                    )}
                </CardContent>
            </Card>
        </div>
    );
});

