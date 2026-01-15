import { SimplePageHeader } from "@/components/page-header";
import { Redis } from "@upstash/redis";
import type { Metadata } from "next";

const redis = Redis.fromEnv();

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Briefing",
  description: "Today's briefing.",
};

export default async function BriefingPage() {
  const [briefing, lastUpdatedAt] = await Promise.all([
    redis.get<string>("briefing:latest"),
    redis.get<string>("briefing:lastUpdatedAt"),
  ]);

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-6 pb-16">
      <SimplePageHeader title="briefing" />
      {lastUpdatedAt ? (
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(lastUpdatedAt).toLocaleString("fr-FR")}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          No briefing has been generated yet.
        </p>
      )}

      {briefing ? (
        <p className="whitespace-pre-wrap text-lg leading-relaxed font-mono text-pretty">
          {briefing}
        </p>
      ) : (
        <div className="rounded-md border p-4 text-sm text-muted-foreground">
          Once the cron runs (or you invoke it manually), today&apos;s briefing
          will appear here.
        </div>
      )}
    </main>
  );
}
