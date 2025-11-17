"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { ContactForm } from "../../_components/contact-form";

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params?.id as string;
  const utils = api.useUtils();

  const {
    data: contact,
    isLoading,
    error,
  } = api.contact.getById.useQuery({
    id: contactId,
  });

  const updateContact = api.contact.update.useMutation({
    onSuccess: async () => {
      // Invalidate queries to refetch updated data
      await utils.contact.getById.invalidate({ id: contactId });
      await utils.contact.getAll.invalidate();
      router.push(`/contacts/${contactId}`);
    },
  });

  const handleUpdate = async (
    data: Parameters<typeof updateContact.mutate>[0],
  ) => {
    updateContact.mutate({
      ...data,
      id: contactId,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading contact...</p>
        </div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="container mx-auto p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-red-800">
            Contact Not Found
          </h2>
          <p className="text-red-600">
            The contact you&apos;re trying to edit doesn&apos;t exist or you
            don&apos;t have permission to edit it.
          </p>
          <Link
            href="/contacts"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            ← Back to Contacts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/contacts/${contactId}`}
          className="mb-2 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Contact
        </Link>
        <h1 className="text-4xl font-bold">Edit Contact</h1>
        <p className="mt-2 text-gray-600">
          Update contact information below. All fields are optional.
        </p>
      </div>

      {/* Edit Form */}
      <div className="rounded-lg border border-gray-300 bg-white p-6 shadow">
        <ContactForm
          initialData={contact}
          onSubmit={(data) => handleUpdate({ id: contactId, ...data })}
          onCancel={() => router.push(`/contacts/${contactId}`)}
          isLoading={updateContact.isPending}
          mode="edit"
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
