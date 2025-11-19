"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { ContactList, ContactForm } from "./index";

export function ContactsSection() {
    const [showForm, setShowForm] = useState(false);

    const createContact = api.contact.create.useMutation({
        onSuccess: () => {
            setShowForm(false);
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
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    {showForm ? "Cancel" : "+ Add Contact"}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 rounded-lg border border-gray-300 bg-white p-6 shadow">
                    <h2 className="mb-4 text-2xl font-semibold">Create New Contact</h2>
                    <ContactForm
                        onSubmit={handleCreate}
                        onCancel={() => setShowForm(false)}
                        isLoading={createContact.isPending}
                        mode="create"
                    />
                </div>
            )}

            <ContactList />
        </div>
    );
}

