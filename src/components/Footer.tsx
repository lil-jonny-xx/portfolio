import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          {/* Decorative oversized monogram, drawn as SVG so it is not read or contrast-checked as text. */}
          <svg viewBox="0 0 300 110" className="h-auto w-[clamp(9rem,36vw,26rem)]" aria-hidden="true" focusable="false">
            <text x="0" y="96" fill="var(--surface-3)" className="display" fontSize="128">
              {site.monogram}
            </text>
          </svg>
          <p className="meta mt-4">
            © {site.name} · {site.location}
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="meta flex flex-wrap gap-6">
            <li>
              <Link href="/#work" className="link-u hover:!text-fg">
                Work
              </Link>
            </li>
            <li>
              <Link href="/#about" className="link-u hover:!text-fg">
                About
              </Link>
            </li>
            <li>
              <Link href="/#top" className="link-u hover:!text-fg">
                Back to top ↑
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
