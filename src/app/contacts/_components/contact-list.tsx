"use client";

import { useState, useEffect, useMemo, Fragment } from "react";
import { useRouter } from "next/navigation";
import { api, type RouterOutputs } from "~/trpc/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ContactForm } from "./contact-form";
import { useColumnConfig } from "@/hooks/use-column-config";
import { ColumnSettingsDialog } from "@/components/column-settings-dialog";
import { Settings2, ArrowUp, ArrowDown } from "lucide-react";

interface ContactListProps {
    onContactClick?: (contactId: string) => void;
    showActions?: boolean;
    limit?: number;
}

export function ContactList({
    onContactClick,
    showActions = true,
    limit,
}: ContactListProps) {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [editingContact, setEditingContact] = useState<string | null>(null);
    const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);
    const utils = api.useUtils();
    const router = useRouter();

    const {
        columns,
        visibleColumns,
        sortedColumns,
        updateColumn,
        toggleColumnVisibility,
        renameColumn,
        reorderColumns,
        setSortDirection,
        resetToDefaults,
    } = useColumnConfig({
        storageKey: "contact-list-columns",
        defaultColumns: [
            { id: "name", label: "Name", visible: true, order: 0 },
            { id: "email", label: "Email", visible: true, order: 1 },
            { id: "phone", label: "Phone", visible: true, order: 2 },
            { id: "company", label: "Company", visible: true, order: 3 },
            { id: "jobTitle", label: "Job Title", visible: true, order: 4 },
            { id: "tags", label: "Tags", visible: true, order: 5 },
        ],
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading } = api.contact.getAll.useQuery({
        search: debouncedSearch || undefined,
        limit: limit,
    });

    const sortedContacts = useMemo(() => {
        if (!data?.contacts) return [];
        if (sortedColumns.length === 0) return data.contacts;

        const sortCol = sortedColumns[0];
        if (!sortCol) return data.contacts;

        return [...data.contacts].sort((a, b) => {
            let comparison = 0;

            switch (sortCol.id) {
                case "name":
                    const aName = ((`${a.firstName ?? ""} ${a.lastName ?? ""}`.trim() || a.email) ?? "");
                    const bName = ((`${b.firstName ?? ""} ${b.lastName ?? ""}`.trim() || b.email) ?? "");
                    comparison = aName.localeCompare(bName);
                    break;
                case "email":
                    comparison = (a.email ?? "").localeCompare(b.email ?? "");
                    break;
                case "phone":
                    comparison = (a.phone ?? "").localeCompare(b.phone ?? "");
                    break;
                case "company":
                    comparison = (a.company ?? "").localeCompare(b.company ?? "");
                    break;
                case "jobTitle":
                    comparison = (a.jobTitle ?? "").localeCompare(b.jobTitle ?? "");
                    break;
                case "tags":
                    const aTags = (a.tags ?? []).join(", ");
                    const bTags = (b.tags ?? []).join(", ");
                    comparison = aTags.localeCompare(bTags);
                    break;
            }

            return sortCol.sortDirection === "asc" ? comparison : -comparison;
        });
    }, [data?.contacts, sortedColumns]);

    const deleteContact = api.contact.delete.useMutation({
        onSuccess: () => {
            void utils.contact.getAll.invalidate();
        },
    });

    const updateContact = api.contact.update.useMutation({
        onSuccess: () => {
            setEditingContact(null);
            void utils.contact.getAll.invalidate();
        },
    });

    const { data: contactToEdit } = api.contact.getById.useQuery(
        { id: editingContact ?? "" },
        { enabled: !!editingContact }
    );

    const handleRowClick = (contactId: string) => {
        if (onContactClick) {
            onContactClick(contactId);
        } else {
            router.push(`/contacts/${contactId}`);
        }
    };

    type Contact = RouterOutputs["contact"]["getAll"]["contacts"][number];

    const renderCell = (contact: Contact, columnId: string) => {
        switch (columnId) {
            case "name":
                return (
                    <TableCell className="font-medium">
                        {contact.firstName || contact.lastName ? (
                            `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim()
                        ) : (
                            <span className="text-muted-foreground italic">(No name)</span>
                        )}
                    </TableCell>
                );
            case "email":
                return (
                    <TableCell>
                        {contact.email ?? <span className="text-muted-foreground">—</span>}
                    </TableCell>
                );
            case "phone":
                return (
                    <TableCell>
                        {contact.phone ?? <span className="text-muted-foreground">—</span>}
                    </TableCell>
                );
            case "company":
                return (
                    <TableCell>
                        {contact.company ?? <span className="text-muted-foreground">—</span>}
                    </TableCell>
                );
            case "jobTitle":
                return (
                    <TableCell>
                        {contact.jobTitle ?? <span className="text-muted-foreground">—</span>}
                    </TableCell>
                );
            case "tags":
                return (
                    <TableCell>
                        {contact.tags && contact.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {contact.tags.map((tag, idx) => (
                                    <Badge key={idx} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <span className="text-muted-foreground">—</span>
                        )}
                    </TableCell>
                );
            default:
                return <TableCell>—</TableCell>;
        }
    };

    return (
        <div className="space-y-4">
            {/* Search Bar and Column Settings */}
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Search contacts by name, email, or company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1"
                />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setColumnSettingsOpen(true)}
                    title="Column Settings"
                >
                    <Settings2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">Loading contacts...</p>
                </div>
            ) : (
                <div className="rounded-lg border">
                    <div className="overflow-x-auto">
                        {data?.contacts.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <p>No contacts found.</p>
                                {search && (
                                    <p className="mt-2 text-sm">
                                        Try adjusting your search terms.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Results Header */}
                                <div className="border-b bg-muted/50 px-6 py-3">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {data?.contacts.length ?? 0} of {data?.total ?? 0}{" "}
                                        contact(s)
                                        {search && ` matching "${search}"`}
                                    </p>
                                </div>

                                {/* Table */}
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {visibleColumns.map((column) => {
                                                const sortCol = sortedColumns.find((sc) => sc.id === column.id);
                                                return (
                                                    <TableHead
                                                        key={column.id}
                                                        className="cursor-pointer select-none"
                                                        onClick={() => {
                                                            if (sortCol?.sortDirection === "asc") {
                                                                setSortDirection(column.id, "desc");
                                                            } else if (sortCol?.sortDirection === "desc") {
                                                                setSortDirection(column.id, null);
                                                            } else {
                                                                setSortDirection(column.id, "asc");
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {column.label}
                                                            {sortCol?.sortDirection === "asc" && (
                                                                <ArrowUp className="h-3 w-3" />
                                                            )}
                                                            {sortCol?.sortDirection === "desc" && (
                                                                <ArrowDown className="h-3 w-3" />
                                                            )}
                                                        </div>
                                                    </TableHead>
                                                );
                                            })}
                                            {showActions && <TableHead className="text-right">Actions</TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedContacts.map((contact) => (
                                            <TableRow
                                                key={contact.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => handleRowClick(contact.id)}
                                            >
                                                {visibleColumns.map((column) => (
                                                    <Fragment key={column.id}>
                                                        {renderCell(contact, column.id)}
                                                    </Fragment>
                                                ))}
                                                {showActions && (
                                                    <TableCell
                                                        className="text-right"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="link"
                                                                className="h-auto p-0"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditingContact(contact.id);
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="link"
                                                                className="h-auto p-0 text-destructive hover:text-destructive"
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            "Are you sure you want to delete this contact?",
                                                                        )
                                                                    ) {
                                                                        deleteContact.mutate({ id: contact.id });
                                                                    }
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            <Dialog open={!!editingContact} onOpenChange={(open) => !open && setEditingContact(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Contact</DialogTitle>
                    </DialogHeader>
                    {contactToEdit && (
                        <ContactForm
                            initialData={contactToEdit}
                            onSubmit={async (data) => {
                                if (editingContact) {
                                    await updateContact.mutateAsync({ id: editingContact, ...data });
                                }
                            }}
                            onCancel={() => setEditingContact(null)}
                            isLoading={updateContact.isPending}
                            mode="edit"
                            submitLabel="Save Changes"
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Column Settings Dialog */}
            <ColumnSettingsDialog
                open={columnSettingsOpen}
                onOpenChange={setColumnSettingsOpen}
                columns={columns}
                onUpdateColumn={updateColumn}
                onToggleVisibility={toggleColumnVisibility}
                onRenameColumn={renameColumn}
                onReorderColumns={reorderColumns}
                onSetSortDirection={setSortDirection}
                onResetToDefaults={resetToDefaults}
            />
        </div>
    );
}

