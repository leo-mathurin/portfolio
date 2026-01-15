import { SimplePageHeader } from "@/components/page-header";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const dynamic = "force-dynamic";

export default async function BriefingPage() {
  const [briefing, lastUpdatedAt] = await Promise.all([
    redis.get<string>("briefing:latest"),
    redis.get<string>("briefing:lastUpdatedAt"),
  ]);

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-6">
      <SimplePageHeader title="briefing" />
      {lastUpdatedAt ? (
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(lastUpdatedAt).toLocaleString()}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          No briefing has been generated yet.
        </p>
      )}

      {briefing ? (
        <pre className="whitespace-pre-wrap rounded-md border bg-background p-4 text-sm leading-relaxed">
          {briefing}
        </pre>
      ) : (
        <div className="rounded-md border p-4 text-sm text-muted-foreground">
          Once the cron runs (or you invoke it manually), today&apos;s briefing
          will appear here.
        </div>
      )}
    </main>
  );
}
