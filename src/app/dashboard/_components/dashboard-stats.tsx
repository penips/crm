"use client";

import { api } from "~/trpc/react";
import { Users, Building2, TrendingUp } from "lucide-react";

export function DashboardStats() {
    const { data: stats, isLoading } = api.contact.getStats.useQuery();

    if (isLoading) {
        return (
            <main className="flex min-h-[calc(100vh-4rem)] flex-col">
                <div className="container mx-auto p-8">
                    <h1 className="mb-8 text-4xl font-bold">Dashboard</h1>
                    <div className="flex items-center justify-center py-12">
                        <p className="text-gray-500">Loading statistics...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-[calc(100vh-4rem)] flex-col">
            <div className="container mx-auto p-8">
                <h1 className="mb-8 text-4xl font-bold">Dashboard</h1>
                
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Total Contacts Card */}
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Contacts
                                </p>
                                <p className="mt-2 text-3xl font-bold">
                                    {stats?.totalContacts ?? 0}
                                </p>
                            </div>
                            <div className="rounded-full bg-primary/10 p-3">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Total Companies Card */}
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Companies
                                </p>
                                <p className="mt-2 text-3xl font-bold">
                                    {stats?.totalCompanies ?? 0}
                                </p>
                            </div>
                            <div className="rounded-full bg-primary/10 p-3">
                                <Building2 className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Recent Contacts Card */}
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Recent (30 days)
                                </p>
                                <p className="mt-2 text-3xl font-bold">
                                    {stats?.recentContacts ?? 0}
                                </p>
                            </div>
                            <div className="rounded-full bg-primary/10 p-3">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

