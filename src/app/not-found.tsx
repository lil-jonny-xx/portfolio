import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col justify-center pt-[var(--nav-h)]">
      <p className="meta">Error 404</p>
      <h1 className="display mt-6 text-[length:var(--text-h2)]">
        Nothing
        <br />
        at this address
      </h1>
      <p className="mt-6 max-w-[48ch] text-muted">The page or project you were looking for does not exist, or has moved.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Home
        </Link>
        <Link href="/#work" className="btn">
          All work
        </Link>
      </div>
    </section>
  );
}
