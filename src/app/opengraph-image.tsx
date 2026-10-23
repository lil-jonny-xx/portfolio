import { site } from "@/data/site";
import { ogImage, ogSize } from "@/lib/og";

export const alt = `${site.name} — engineering portfolio`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("Engineering / Cloud / Systems", "I build systems that scale.", `${site.name} · ${site.institute}`);
}
