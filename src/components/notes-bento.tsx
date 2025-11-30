"use client";

import Image from "next/image";
import { useState } from "react";

export type BentoItem = {
  src: string;
  alt: string;
  flexGrow?: number;
  type?: "image" | "video";
  className?: string;
};

type BentoColumn = BentoItem[];

type NotesBentoProps = {
  columns: BentoColumn[];
  height?: string;
  className?: string;
};

function BentoItem({
  src,
  alt,
  flexGrow = 1,
  type = "image",
  className = "",
}: BentoItem) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-muted/50 ${className}`}
      style={{ flexGrow }}
    >
      {type === "image" ? (
        <Image
          src={src}
          alt={alt}
          fill
          loading="lazy"
          className={`object-cover transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <video
          src={src}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      )}
    </div>
  );
}

export function NotesBento({
  columns,
  height = "2800px",
  className = "",
}: NotesBentoProps) {
  const [col1, col2, col3] = columns;

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${className}`}
      style={{ height }}
    >
      {/* Column 1 */}
      <div className="flex flex-col gap-3 h-full">
        {col1?.map((item, index) => (
          <BentoItem key={`col1-${index}`} {...item} />
        ))}
        {/* Column 3 items distributed to column 1 on small screens */}
        {col3 && (
          <>
            {col3.slice(0, Math.ceil(col3.length / 2)).map((item, index) => (
              <BentoItem
                key={`col3-col1-${index}`}
                {...item}
                className="md:hidden"
              />
            ))}
          </>
        )}
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-3 h-full">
        {col2?.map((item, index) => (
          <BentoItem key={`col2-${index}`} {...item} />
        ))}
        {/* Column 3 items distributed to column 2 on small screens */}
        {col3 && (
          <>
            {col3.slice(Math.ceil(col3.length / 2)).map((item, index) => (
              <BentoItem
                key={`col3-col2-${index}`}
                {...item}
                className="md:hidden"
              />
            ))}
          </>
        )}
      </div>

      {/* Column 3 - hidden on small screens, shown on md+ */}
      {col3 && (
        <div className="hidden md:flex flex-col gap-3 h-full">
          {col3.map((item, index) => (
            <BentoItem key={`col3-${index}`} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
