"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params?.id as string;

  const { data: contact, isLoading, error } = api.contact.getById.useQuery({
    id: contactId,
  });

  const deleteContact = api.contact.delete.useMutation({
    onSuccess: () => {
      router.push("/contacts");
    },
  });

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete ${contact?.firstName ?? ""} ${contact?.lastName ?? ""}? This action cannot be undone.`,
      )
    ) {
      deleteContact.mutate({ id: contactId });
    }
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
            The contact you're looking for doesn't exist or you don't have
            permission to view it.
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/contacts"
            className="mb-2 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Contacts
          </Link>
          <h1 className="text-4xl font-bold">
            {contact.firstName || contact.lastName
              ? `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim()
              : "Contact Details"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/contacts/${contact.id}/edit`}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteContact.isPending}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleteContact.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="rounded-lg border border-gray-300 bg-white shadow">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Contact Information
          </h2>
        </div>

        <div className="p-6">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Name */}
            <div>
              <dt className="text-sm font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {contact.firstName || contact.lastName
                  ? `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim()
                  : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
              </dd>
            </div>

            {/* Email */}
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {contact.email}
                  </a>
                ) : (
                  <span className="text-gray-400">Not provided</span>
                )}
              </dd>
            </div>

            {/* Phone */}
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {contact.phone}
                  </a>
                ) : (
                  <span className="text-gray-400">Not provided</span>
                )}
              </dd>
            </div>

            {/* Company */}
            <div>
              <dt className="text-sm font-medium text-gray-500">Company</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {contact.company ?? (
                  <span className="text-gray-400">Not provided</span>
                )}
              </dd>
            </div>

            {/* Job Title */}
            <div>
              <dt className="text-sm font-medium text-gray-500">Job Title</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {contact.jobTitle ?? (
                  <span className="text-gray-400">Not provided</span>
                )}
              </dd>
            </div>

            {/* Tags */}
            <div>
              <dt className="text-sm font-medium text-gray-500">Tags</dt>
              <dd className="mt-1">
                {contact.tags && contact.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">No tags</span>
                )}
              </dd>
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {contact.notes ? (
                  <div className="whitespace-pre-wrap rounded-md bg-gray-50 p-3">
                    {contact.notes}
                  </div>
                ) : (
                  <span className="text-gray-400">No notes</span>
                )}
              </dd>
            </div>

            {/* Created Date */}
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(contact.createdAt).toLocaleString()}
              </dd>
            </div>

            {/* Updated Date */}
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(contact.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

