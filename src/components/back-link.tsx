import { Icons } from "@/components/icons";
import Link from "next/link";

interface BackLinkProps {
  href?: string;
  label: string;
}

export function BackLink({ href = "/", label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <Icons.arrowLeft className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </Link>
  );
}
