"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ContactForm } from "./contact-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ContactDetailProps {
    contactId: string;
}

const STAGE_COLORS: Record<string, string> = {
    lead: "bg-blue-100 text-blue-800",
    qualified: "bg-purple-100 text-purple-800",
    proposal: "bg-yellow-100 text-yellow-800",
    negotiation: "bg-orange-100 text-orange-800",
    "closed-won": "bg-green-100 text-green-800",
    "closed-lost": "bg-red-100 text-red-800",
};

export function ContactDetail({ contactId }: ContactDetailProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const utils = api.useUtils();

    const { data: contact, isLoading, error } = api.contact.getById.useQuery({
        id: contactId,
    });

    const { data: associatedDeals, isLoading: dealsLoading } = api.contact.getDeals.useQuery({
        id: contactId,
    });

    const deleteContact = api.contact.delete.useMutation({
        onSuccess: () => {
            router.push("/dashboard");
        },
    });

    const updateContact = api.contact.update.useMutation({
        onSuccess: async () => {
            setIsEditing(false);
            await utils.contact.getById.invalidate({ id: contactId });
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
                <div className="space-y-6">
                    <Skeleton className="h-10 w-64" />
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i}>
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-5 w-full" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error || !contact) {
        return (
            <div className="container mx-auto p-8">
                <Alert variant="destructive">
                    <AlertTitle>Contact Not Found</AlertTitle>
                    <AlertDescription>
                        The contact you&apos;re looking for doesn&apos;t exist or you don&apos;t have
                        permission to view it.
                    </AlertDescription>
                    <div className="mt-4">
                        <Button variant="outline" asChild>
                            <Link href="/contacts">← Back to Contacts</Link>
                        </Button>
                    </div>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Button variant="ghost" asChild className="mb-2">
                        <Link href="/contacts">← Back to Contacts</Link>
                    </Button>
                    <h1 className="text-4xl font-bold">
                        {contact.firstName || contact.lastName
                            ? `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim()
                            : "Contact Details"}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsEditing(true)}>
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteContact.isPending}
                    >
                        {deleteContact.isPending ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>

            {/* Contact Information and Deals - Side by Side */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Contact Information Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <dl className="grid grid-cols-1 gap-3">
                            {/* Name */}
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground mb-0.5">Full Name</dt>
                                <dd className="text-sm text-foreground">
                                    {contact.firstName || contact.lastName
                                        ? `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim()
                                        : (
                                            <span className="text-muted-foreground italic">Not provided</span>
                                        )}
                                </dd>
                            </div>

                            {/* Email */}
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground mb-0.5">Email</dt>
                                <dd className="text-sm text-foreground">
                                    {contact.email ? (
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="text-primary hover:underline"
                                        >
                                            {contact.email}
                                        </a>
                                    ) : (
                                        <span className="text-muted-foreground">Not provided</span>
                                    )}
                                </dd>
                            </div>

                            {/* Phone */}
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground mb-0.5">Phone</dt>
                                <dd className="text-sm text-foreground">
                                    {contact.phone ? (
                                        <a
                                            href={`tel:${contact.phone}`}
                                            className="text-primary hover:underline"
                                        >
                                            {contact.phone}
                                        </a>
                                    ) : (
                                        <span className="text-muted-foreground">Not provided</span>
                                    )}
                                </dd>
                            </div>

                            {/* Company */}
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground mb-0.5">Company</dt>
                                <dd className="text-sm text-foreground">
                                    {contact.company ?? (
                                        <span className="text-muted-foreground">Not provided</span>
                                    )}
                                </dd>
                            </div>

                            {/* Job Title */}
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground mb-0.5">Job Title</dt>
                                <dd className="text-sm text-foreground">
                                    {contact.jobTitle ?? (
                                        <span className="text-muted-foreground">Not provided</span>
                                    )}
                                </dd>
                            </div>

                            {/* Tags */}
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground mb-0.5">Tags</dt>
                                <dd>
                                    {contact.tags && contact.tags.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {contact.tags.map((tag, idx) => (
                                                <Badge key={idx} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">No tags</span>
                                    )}
                                </dd>
                            </div>

                            {/* Notes */}
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground mb-0.5">Notes</dt>
                                <dd className="text-sm text-foreground">
                                    {contact.notes ? (
                                        <div className="whitespace-pre-wrap rounded-md bg-muted p-2 text-sm text-foreground max-h-32 overflow-y-auto">
                                            {contact.notes}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">No notes</span>
                                    )}
                                </dd>
                            </div>

                            {/* Created and Updated Date - Side by side */}
                            <div className="grid grid-cols-2 gap-3 pt-1 border-t">
                                <div>
                                    <dt className="text-xs font-medium text-muted-foreground mb-0.5">Created</dt>
                                    <dd className="text-xs text-foreground">
                                        {new Date(contact.createdAt).toLocaleDateString()}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs font-medium text-muted-foreground mb-0.5">Updated</dt>
                                    <dd className="text-xs text-foreground">
                                        {contact.updatedAt
                                            ? new Date(contact.updatedAt).toLocaleDateString()
                                            : <span className="text-muted-foreground">—</span>}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                {/* Associated Deals Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Associated Deals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {dealsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <p className="text-sm text-muted-foreground">Loading deals...</p>
                            </div>
                        ) : associatedDeals && associatedDeals.length > 0 ? (
                            <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="h-8 text-xs">Deal Name</TableHead>
                                            <TableHead className="h-8 text-xs">Stage</TableHead>
                                            <TableHead className="h-8 text-xs">Value</TableHead>
                                            <TableHead className="h-8 text-xs">Close Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {associatedDeals.map((deal) => (
                                            <TableRow
                                                key={deal.id}
                                                className="cursor-pointer hover:bg-muted/50 h-10"
                                                onClick={() => router.push(`/deals/${deal.id}`)}
                                            >
                                                <TableCell className="font-medium text-sm py-2">{deal.name}</TableCell>
                                                <TableCell className="py-2">
                                                    <Badge
                                                        className={`${STAGE_COLORS[deal.stage] ?? "bg-gray-100 text-gray-800"} text-xs`}
                                                    >
                                                        {deal.stage.replace("-", " ")}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs py-2">
                                                    {deal.value
                                                        ? `${deal.currency ?? "NZD"} ${parseFloat(deal.value).toLocaleString()}`
                                                        : "—"}
                                                </TableCell>
                                                <TableCell className="text-xs py-2">
                                                    {deal.expectedCloseDate
                                                        ? new Date(deal.expectedCloseDate).toLocaleDateString()
                                                        : "—"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                <p>No deals associated with this contact.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Contact</DialogTitle>
                    </DialogHeader>
                    <ContactForm
                        initialData={contact}
                        onSubmit={async (data) => {
                            await updateContact.mutateAsync({ id: contactId, ...data });
                        }}
                        onCancel={() => setIsEditing(false)}
                        isLoading={updateContact.isPending}
                        mode="edit"
                        submitLabel="Save Changes"
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

