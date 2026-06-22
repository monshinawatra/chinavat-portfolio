import Image from "next/image";

const isVideo = (u: string) => /\.(mp4|webm)$/i.test(u);

function Media({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  if (isVideo(src)) {
    return (
      <video
        src={src}
        controls
        playsInline
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 720px"
      className="object-cover"
      priority={priority}
    />
  );
}

export default function Gallery({
  hero,
  gallery,
  alt,
}: {
  hero: string | null;
  gallery: string[];
  alt: string;
}) {
  return (
    <div className="space-y-3">
      {hero && (
        <div className="relative aspect-video w-full overflow-hidden border border-line bg-panel">
          <Media src={hero} alt={alt} priority />
        </div>
      )}
      {gallery.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {gallery.map((src) => (
            <div
              key={src}
              className="relative aspect-square overflow-hidden border border-line bg-panel"
            >
              <Media src={src} alt={alt} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
