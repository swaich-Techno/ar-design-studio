"use client";

export default function GlobalError({ error, reset }) {
  const digest = String(error?.digest || "").replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase();
  const reference = digest ? `BS-${digest}` : "BS-ERR";

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#080809", color: "#f3efe6", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <div style={{ maxWidth: 420, textAlign: "center" }}>
            <h1 style={{ fontSize: 28, margin: "0 0 12px" }}>This page could not be loaded.</h1>
            <p style={{ color: "#9b9589" }}>Please try again. If it continues, quote the error reference below.</p>
            <p style={{ marginTop: 16, fontFamily: "ui-monospace, monospace", color: "#d4b36a" }}>Error reference: {reference}</p>
            <button type="button" onClick={() => reset()} style={{ marginTop: 24, minHeight: 44, padding: "0 20px", borderRadius: 999, border: 0, background: "#d4b36a", fontWeight: 600 }}>
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
