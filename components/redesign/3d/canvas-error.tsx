"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };

export class CanvasErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        this.props.fallback ?? (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_50%_38%,#3a2d62,transparent_58%)]" />
        )
      );
    }
    return this.props.children;
  }
}
