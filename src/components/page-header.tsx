import Image from "next/image";

interface PageHeaderProps {
  /**
   * Main title text for the page header
   */
  title: string;
  /**
   * Optional subtitle/description text
   */
  subtitle?: string;
  /**
   * Optional avatar image configuration
   */
  avatar?: {
    src: string;
    alt: string;
  };
}

/**
 * Reusable page header component that renders instantly without animations.
 * This is a Server Component by default - no "use client" directive.
 * Used for LCP optimization on page headers.
 */
export function PageHeader({ title, subtitle, avatar }: PageHeaderProps) {
  return (
    <section id="hero">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="gap-2 flex justify-between">
          <div className="flex-col flex flex-1 space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-pretty">
              {title}
            </h1>
            {subtitle && (
              <p className="max-w-[600px] md:text-xl text-balance text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          {avatar && (
            <div className="size-28 border rounded-full overflow-hidden flex-shrink-0">
              <Image
                alt={avatar.alt}
                src={avatar.src}
                width={112}
                height={112}
                priority
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Simple page header variant without avatar - just title and optional subtitle.
 * Renders instantly for optimal LCP.
 */
export function SimplePageHeader({
  title,
  subtitle,
}: Omit<PageHeaderProps, "avatar">) {
  return (
    <section id="hero">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="gap-2 flex justify-between">
          <div className="flex-col flex flex-1 space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-pretty">
              {title}
            </h1>
            {subtitle && (
              <p className="max-w-[600px] md:text-xl text-balance text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

