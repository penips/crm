"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { ContactList } from "./_components/contact-list";
import { ContactForm } from "./_components/contact-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ContactsPage() {
    const [showForm, setShowForm] = useState(false);
    const utils = api.useUtils();

    const createContact = api.contact.create.useMutation({
        onSuccess: () => {
            setShowForm(false);
            void utils.contact.getAll.invalidate();
        },
    });

    const handleCreate = async (
        data: Parameters<typeof createContact.mutate>[0],
    ) => {
        createContact.mutate(data);
    };

    return (
        <div className="container mx-auto p-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-4xl font-bold">Contacts</h1>
                <Button onClick={() => setShowForm(true)}>
                    + Add Contact
                </Button>
            </div>

            <ContactList />

            {/* Create Modal */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Contact</DialogTitle>
                    </DialogHeader>
                    <ContactForm
                        onSubmit={handleCreate}
                        onCancel={() => setShowForm(false)}
                        isLoading={createContact.isPending}
                        mode="create"
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
