export default function Terminal() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
        <p className="text-sm text-muted">
          <span className="text-accent">chinavat</span> ~ % whoami
          <span className="cursor" aria-hidden />
        </p>
        <h1 className="mt-6 font-display text-4xl font-bold uppercase tracking-tight md:text-6xl">
          Chinavat
        </h1>
        <p className="mt-5 max-w-xl text-fg">
          ML researcher &amp; game maker. I work on diffusion models, agents, and
          reinforcement learning — and ship games in 48 hours when the jam clock
          starts.
        </p>
        <div className="mt-8 flex gap-4 text-sm">
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener"
            className="border border-line px-3 py-1.5 text-accent transition-colors hover:border-accent"
          >
            cv.pdf ↗
          </a>
        </div>
      </div>
    </header>
  );
}
