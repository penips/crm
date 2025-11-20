"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { DealList } from "./_components/deal-list";
import { DealForm } from "./_components/deal-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function DealsPage() {
    const [showForm, setShowForm] = useState(false);
    const utils = api.useUtils();

    const createDeal = api.deal.create.useMutation({
        onSuccess: () => {
            setShowForm(false);
            void utils.deal.getAll.invalidate();
        },
    });

    const handleCreate = async (
        data: Omit<{ name: string; notes?: string; stage?: "lead" | "qualified" | "proposal" | "negotiation" | "closed-won" | "closed-lost"; value?: string; currency?: string; expectedCloseDate?: string; contactIds?: string[] }, "expectedCloseDate"> & { expectedCloseDate?: Date | null; contactIds?: string[] },
    ) => {
        createDeal.mutate({
            name: data.name,
            stage: data.stage,
            value: data.value,
            currency: data.currency,
            contactIds: data.contactIds,
            expectedCloseDate: data.expectedCloseDate ?? undefined,
            notes: data.notes,
        });
    };

    return (
        <div className="container mx-auto p-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-4xl font-bold">Deals</h1>
                <Button onClick={() => setShowForm(true)}>
                    + Add Deal
                </Button>
            </div>

            <DealList />

            {/* Create Modal */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Deal</DialogTitle>
                    </DialogHeader>
                    <DealForm
                        onSubmit={handleCreate}
                        onCancel={() => setShowForm(false)}
                        isLoading={createDeal.isPending}
                        mode="create"
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

