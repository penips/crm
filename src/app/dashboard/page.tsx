import { getSession } from "~/server/better-auth/server";
import { redirect } from "next/navigation";
import { HydrateClient } from "~/trpc/server";
import { DashboardStats } from "./_components/dashboard-stats";

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) {
        redirect("/");
    }
    return (
        <HydrateClient>
            <DashboardStats />
        </HydrateClient>
    );
}
