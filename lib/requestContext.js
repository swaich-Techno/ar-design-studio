import { NextResponse } from "next/server";

export function makeErrorRef() {
  const bytes = new Uint8Array(2);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    bytes[0] = Math.floor(Math.random() * 256);
    bytes[1] = Math.floor(Math.random() * 256);
  }
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `BS-${hex}`;
}

export function getRequestId(request) {
  return request?.headers?.get?.("x-request-id") || request?.headers?.get?.("x-vercel-id") || makeErrorRef();
}

export function publicErrorBody(message, errorRef) {
  return {
    error: message,
    errorReference: errorRef
  };
}

export function jsonPublicError(message, status, errorRef, extraHeaders = {}) {
  const ref = errorRef || makeErrorRef();
  return NextResponse.json(publicErrorBody(message, ref), {
    status,
    headers: { "x-error-ref": ref, ...extraHeaders }
  });
}

export function logServerError({ requestId, errorRef, route, error }) {
  const message = error?.message || String(error || "Unknown error");
  console.error(
    JSON.stringify({
      level: "error",
      ts: new Date().toISOString(),
      requestId,
      errorRef,
      route,
      message
    })
  );
}
