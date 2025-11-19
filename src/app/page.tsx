import { SignInButton } from "~/components/sign-in-button";
import { getSession } from "~/server/better-auth/server";
import { redirect } from "next/navigation";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
    const session = await getSession();
    if (session) {
        redirect("/dashboard");
    }
    return (
        <HydrateClient>
            <main className="flex min-h-[calc(100vh-4rem)] flex-col">
                <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16">
                    <div className="w-full max-w-2xl text-center">
                        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                            Welcome to{" "}
                            <span className="text-blue-600">CRM</span>
                        </h1>
                        <p className="mb-8 text-xl text-gray-600">
                            Manage your contacts efficiently with our contact-focused CRM
                            system.
                        </p>
                        <div className="flex flex-col items-center gap-4">
                            <SignInButton />
                        </div>
                    </div>
                </div>
            </main>
        </HydrateClient>
    );
}
