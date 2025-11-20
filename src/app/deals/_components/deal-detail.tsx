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
import { DealForm } from "./deal-form";

interface DealDetailProps {
    dealId: string;
}

const STAGE_COLORS: Record<string, string> = {
  lead: "bg-blue-100 text-blue-800",
  qualified: "bg-purple-100 text-purple-800",
  proposal: "bg-yellow-100 text-yellow-800",
  negotiation: "bg-orange-100 text-orange-800",
  "closed-won": "bg-green-100 text-green-800",
  "closed-lost": "bg-red-100 text-red-800",
};

export function DealDetail({ dealId }: DealDetailProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const utils = api.useUtils();

    const { data: deal, isLoading, error } = api.deal.getById.useQuery({
        id: dealId,
    });

    const deleteDeal = api.deal.delete.useMutation({
        onSuccess: () => {
            router.push("/deals");
        },
    });

    const updateDeal = api.deal.update.useMutation({
        onSuccess: async () => {
            setIsEditing(false);
            await utils.deal.getById.invalidate({ id: dealId });
        },
    });

    const handleDelete = () => {
        if (
            confirm(
                `Are you sure you want to delete "${deal?.name ?? ""}"? This action cannot be undone.`,
            )
        ) {
            deleteDeal.mutate({ id: dealId });
        }
    };

    const formatCurrency = (value: string | null, currency: string | null) => {
        if (!value) return "Not provided";
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return value;
        const currencySymbol = currency === "USD" ? "$" : currency ?? "$";
        return `${currencySymbol}${numValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
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

    if (error || !deal) {
        return (
            <div className="container mx-auto p-8">
                <Alert variant="destructive">
                    <AlertTitle>Deal Not Found</AlertTitle>
                    <AlertDescription>
                        The deal you&apos;re looking for doesn&apos;t exist or you don&apos;t have
                        permission to view it.
                    </AlertDescription>
                    <div className="mt-4">
                        <Button variant="outline" asChild>
                            <Link href="/deals">← Back to Deals</Link>
                        </Button>
                    </div>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Button variant="ghost" asChild className="mb-2">
                        <Link href="/deals">← Back to Deals</Link>
                    </Button>
                    <h1 className="text-4xl font-bold">{deal.name}</h1>
                </div>
                <div className="flex gap-2">
                    {!isEditing ? (
                        <>
                            <Button onClick={() => setIsEditing(true)}>
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={deleteDeal.isPending}
                            >
                                {deleteDeal.isPending ? "Deleting..." : "Delete"}
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </div>

            {isEditing ? (
                /* Edit Form */
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Deal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DealForm
                            initialData={deal}
                            onSubmit={async (data) => {
                                await updateDeal.mutateAsync({ id: dealId, ...data });
                            }}
                            onCancel={() => setIsEditing(false)}
                            isLoading={updateDeal.isPending}
                            mode="edit"
                            submitLabel="Save Changes"
                        />
                    </CardContent>
                </Card>
            ) : (
                /* Deal Information Card */
                <Card>
                    <CardHeader>
                        <CardTitle>Deal Information</CardTitle>
                    </CardHeader>

                <CardContent>
                    <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Deal Name</dt>
                            <dd className="mt-1 text-sm text-foreground">{deal.name}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Stage</dt>
                            <dd className="mt-1">
                                <Badge
                                    variant="secondary"
                                    className={STAGE_COLORS[deal.stage] ?? ""}
                                >
                                    {deal.stage}
                                </Badge>
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Deal Value</dt>
                            <dd className="mt-1 text-sm text-foreground">
                                {formatCurrency(deal.value, deal.currency)}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Currency</dt>
                            <dd className="mt-1 text-sm text-foreground">
                                {deal.currency ?? "Not provided"}
                            </dd>
                        </div>

                        {/* Contacts */}
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-muted-foreground">Contacts</dt>
                            <dd className="mt-1 text-sm text-foreground">
                                {deal.dealContacts && deal.dealContacts.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {deal.dealContacts.map((dealContact) => {
                                            const contact = dealContact.contact;
                                            return (
                                                <Link
                                                    key={contact.id}
                                                    href={`/contacts/${contact.id}`}
                                                    className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-primary hover:underline"
                                                >
                                                    {contact.firstName || contact.lastName
                                                        ? `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim()
                                                        : contact.email ?? "Unnamed Contact"}
                                                    {contact.company && (
                                                        <span className="text-muted-foreground">
                                                            ({contact.company})
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground">No contacts assigned</span>
                                )}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Expected Close Date</dt>
                            <dd className="mt-1 text-sm text-foreground">
                                {deal.expectedCloseDate ? (
                                    new Date(deal.expectedCloseDate).toLocaleDateString()
                                ) : (
                                    <span className="text-muted-foreground">Not provided</span>
                                )}
                            </dd>
                        </div>

                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-muted-foreground">Notes</dt>
                            <dd className="mt-1 text-sm text-foreground">
                                {deal.notes ? (
                                    <div className="whitespace-pre-wrap rounded-md bg-muted p-3 text-foreground">
                                        {deal.notes}
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground">No notes</span>
                                )}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                            <dd className="mt-1 text-sm text-foreground">
                                {new Date(deal.createdAt).toLocaleString()}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                            <dd className="mt-1 text-sm text-foreground">
                                {deal.updatedAt
                                    ? new Date(deal.updatedAt).toLocaleString()
                                    : <span className="text-muted-foreground">Not available</span>}
                            </dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>
            )}
        </div>
    );
}

