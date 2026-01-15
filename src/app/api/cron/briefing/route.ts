import type { NextRequest } from "next/server";
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const baseUrl = process.env.LEO_BACKEND_BASE_URL;
  const apiKey = process.env.LEO_BACKEND_API_KEY;
  if (!baseUrl || !apiKey) {
    return new Response("Server misconfigured", { status: 500 });
  }

  const briefingUrl = `${baseUrl.replace(/\/$/, "")}/briefing/text`;
  const res = await fetch(briefingUrl, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
    },
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    return new Response(`Upstream error (${res.status}): ${text}`, {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const updatedAt = new Date().toISOString();
  await Promise.all([
    redis.set("briefing:latest", text),
    redis.set("briefing:lastUpdatedAt", updatedAt),
  ]);

  return Response.json({ ok: true, updatedAt, length: text.length });
}

