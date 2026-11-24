"use client";

/**
 * Decide whether a decorative WebGL layer should run. It never runs for
 * reduced motion, small screens, data saver, low-power devices or software
 * renderers (SwiftShader/llvmpipe), where it would cost more than it adds.
 */
export function shouldRun3D(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(max-width: 767px)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 8) < 4 || (nav.deviceMemory ?? 8) < 4) return false;
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

/** Run a callback once the page has loaded and the main thread is idle. */
export function whenIdleAfterLoad(cb: () => void): () => void {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
  let idleId: number | undefined;
  const start = () => {
    idleId = w.requestIdleCallback ? w.requestIdleCallback(cb, { timeout: 2500 }) : window.setTimeout(cb, 800);
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
  return () => {
    window.removeEventListener("load", start);
    if (idleId !== undefined) (w.cancelIdleCallback ?? window.clearTimeout)(idleId);
  };
}
