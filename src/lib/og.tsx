import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card: monochrome, big type, small mono metadata. */
export function ogImage(kicker: string, title: string, footer: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#090909",
          color: "#f2efe9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#8a8781", letterSpacing: 3 }}>
          <span>{kicker.toUpperCase()}</span>
          <span style={{ color: "#d6e05a" }}>JVP</span>
        </div>
        <div style={{ display: "flex", fontSize: title.length > 30 ? 84 : 112, fontWeight: 800, lineHeight: 0.95, letterSpacing: -2, textTransform: "uppercase" }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#a3a09a", borderTop: "1px solid #262626", paddingTop: 24 }}>{footer}</div>
      </div>
    ),
    ogSize,
  );
}
