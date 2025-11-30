import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod";

const emailSchema = z.email();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validate email
        const validationResult = emailSchema.safeParse(email);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Initialize Resend
        const resend = new Resend(process.env.RESEND_API_KEY);

        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY is not set");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        // Use the general audience ID
        const audienceId = process.env.RESEND_AUDIENCE_ID;

        if (!audienceId) {
            console.error("RESEND_AUDIENCE_ID is not set");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        // Create contact in Resend
        const contact = await resend.contacts.create({
            email: email,
            unsubscribed: false,
            audienceId: audienceId,
        });

        return NextResponse.json(
            { success: true, contact },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error subscribing to newsletter:", error);

        // Handle Resend API errors
        if (
            error instanceof Error &&
            error.message?.includes("already exists")
        ) {
            return NextResponse.json(
                { error: "This email is already subscribed" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Failed to subscribe to newsletter" },
            { status: 500 }
        );
    }
}

