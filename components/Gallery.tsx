"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const isVideo = (u: string) => /\.(mp4|webm)$/i.test(u);

export default function Gallery({
  hero,
  gallery,
  alt,
}: {
  hero: string | null;
  gallery: string[];
  alt: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<string | null>(null);

  const open = (src: string) => {
    setActive(src);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  // Images open in the lightbox; videos stay inline with their own controls.
  const tile = (src: string, className: string) =>
    isVideo(src) ? (
      <div key={src} className={className}>
        <video
          src={src}
          controls
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
    ) : (
      <button
        key={src}
        type="button"
        onClick={() => open(src)}
        aria-label="View full size"
        className={`group/tile cursor-zoom-in ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover transition-opacity group-hover/tile:opacity-90"
        />
      </button>
    );

  return (
    <div className="space-y-3">
      {hero &&
        tile(
          hero,
          "relative block aspect-video w-full overflow-hidden border border-line bg-panel",
        )}
      {gallery.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {gallery.map((src) =>
            tile(
              src,
              "relative block aspect-square w-full overflow-hidden border border-line bg-panel",
            ),
          )}
        </div>
      )}

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        onClose={() => setActive(null)}
        className="m-auto max-h-[100dvh] max-w-[100vw] bg-transparent p-4"
      >
        {active && (
          <figure className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active}
              alt={alt}
              className="max-h-[85vh] max-w-[90vw] border border-line object-contain"
            />
            <figcaption className="flex w-full items-center justify-between gap-4 text-xs">
              <span className="truncate text-amber">
                {active.split("/").pop()}
              </span>
              <button
                type="button"
                onClick={close}
                className="shrink-0 border border-line px-2 py-0.5 text-muted transition-colors hover:border-amber hover:text-amber"
              >
                close [esc]
              </button>
            </figcaption>
          </figure>
        )}
      </dialog>
    </div>
  );
}
