"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import { shouldRun3D, whenIdleAfterLoad } from "@/lib/utils/webgl";
import { palettes, type FabricPalette } from "@/lib/fabric-palettes";
import { cn } from "@/lib/utils/cn";

const FabricCanvas = dynamic(() => import("@/components/home/FabricCanvas"), { ssr: false });

class Boundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Live 3D fabric that fades in over a static image once the page is idle, on
 * capable devices only. The static image underneath is always the fallback.
 */
export function Fabric3DLayer({ palette = "navySatin", className }: { palette?: keyof typeof palettes | FabricPalette; className?: string }) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!shouldRun3D()) return;
    return whenIdleAfterLoad(() => setEnabled(true));
  }, []);
  if (!enabled) return null;
  const p = typeof palette === "string" ? palettes[palette] : palette;
  return (
    <div aria-hidden="true" className={cn("absolute inset-0 transition-opacity duration-[1.6s]", ready ? "opacity-100" : "opacity-0", className)}>
      <Boundary onError={() => setEnabled(false)}>
        <FabricCanvas palette={p} onReady={() => setReady(true)} onError={() => setEnabled(false)} />
      </Boundary>
    </div>
  );
}
