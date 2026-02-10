import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center">
      <SignIn path="/sign-in" />
    </div>
  );
}
