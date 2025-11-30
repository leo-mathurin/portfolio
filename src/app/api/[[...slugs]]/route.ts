import { Elysia, t } from "elysia";
import { z } from "zod";
import { getBlogPosts } from "@/data/blog";
import { Resend } from "resend";

const emailSchema = z.email();

const app = new Elysia({ prefix: "/api" })
    // Blog endpoint
    .get(
        "/blog",
        async ({ query }) => {
            try {
                const lang = query.lang || "en";
                const posts = await getBlogPosts(lang);
                return posts;
            } catch (error) {
                console.error("Error fetching blog posts:", error);
                return { error: "Failed to fetch blog posts" };
            }
        },
        {
            query: t.Object({
                lang: t.Optional(t.String()),
            }),
        },
    )
    // Latest blog post endpoint
    .get(
        "/blog/latest",
        async ({ query }) => {
            try {
                const lang = query.lang || "en";
                const posts = await getBlogPosts(lang);
                if (posts.length === 0) {
                    return { error: "No blog posts found" };
                }
                const sorted = [...posts].sort(
                    (a, b) =>
                        new Date(b!.metadata.publishedAt).getTime() -
                        new Date(a!.metadata.publishedAt).getTime(),
                );
                return sorted[0];
            } catch (error) {
                console.error("Error fetching latest blog post:", error);
                return { error: "Failed to fetch latest blog post" };
            }
        },
        {
            query: t.Object({
                lang: t.Optional(t.String()),
            }),
        },
    )
    // Newsletter endpoint
    .post(
        "/newsletter",
        async ({ body, status }) => {
            // Validate email
            const validationResult = emailSchema.safeParse(body.email);
            if (!validationResult.success) {
                return status(400, { error: "Invalid email address" });
            }

            // Initialize Resend
            const resend = new Resend(process.env.RESEND_API_KEY);

            if (!process.env.RESEND_API_KEY) {
                console.error("RESEND_API_KEY is not set");
                return status(500, { error: "Server configuration error" });
            }

            // Use the general audience ID
            const audienceId = process.env.RESEND_AUDIENCE_ID;

            if (!audienceId) {
                console.error("RESEND_AUDIENCE_ID is not set");
                return status(500, { error: "Server configuration error" });
            }

            try {
                // Create contact in Resend
                const contact = await resend.contacts.create({
                    email: body.email,
                    unsubscribed: false,
                    audienceId: audienceId,
                });

                return { success: true, contact };
            } catch (err) {
                console.error("Error subscribing to newsletter:", err);

                // Handle Resend API errors
                if (err instanceof Error && err.message?.includes("already exists")) {
                    return status(409, { error: "This email is already subscribed" });
                }

                return status(500, { error: "Failed to subscribe to newsletter" });
            }
        },
        {
            body: t.Object({
                email: t.String(),
            }),
        },
    );

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;

