"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { palettes, type FabricPalette } from "@/lib/fabric-palettes";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  varying vec3 vNormal;
  varying vec3 vPos;
  varying vec2 vUv;

  // One domain-warped fold: h = a * sin(k.x * q.x + w * sin(k.y * q.y + c) + s * t)
  // evaluated in a rotated frame; returns (height, dh/dx, dh/dy) in plane space.
  vec3 fold(vec2 p, float ang, float a, vec2 k, float w, float c, float s, float t) {
    float cs = cos(ang), sn = sin(ang);
    vec2 q = vec2(cs * p.x + sn * p.y, -sn * p.x + cs * p.y);
    float inner = k.y * q.y + c + t * 0.13;
    float u = k.x * q.x + w * sin(inner) + s * t;
    float h = a * sin(u);
    float dqx = a * cos(u) * k.x;
    float dqy = a * cos(u) * w * cos(inner) * k.y;
    // rotate gradient back to plane space
    return vec3(h, cs * dqx - sn * dqy, sn * dqx + cs * dqy);
  }

  void main() {
    vUv = uv;
    vec3 p = position;
    float t = uTime;
    vec3 f = fold(p.xy, 0.35, 0.6, vec2(1.05, 0.42), 1.4, 0.0, 0.32, t)
           + fold(p.xy, -0.25, 0.26, vec2(1.6, 0.7), 0.9, 1.7, -0.24, t)
           + fold(p.xy, 1.2, 0.12, vec2(2.7, 1.1), 0.6, 0.4, 0.4, t);

    // pointer ripple (radial), with analytic gradient
    vec2 dp = p.xy - uPointer;
    float d = length(dp) + 1e-4;
    float env = uPointerStrength * 0.28 * exp(-d * d * 0.5);
    float ph = d * 3.0 - t * 2.0;
    float r = env * sin(ph);
    float dr = env * (3.0 * cos(ph) - d * sin(ph));
    f += vec3(r, dr * dp.x / d, dr * dp.y / d);

    p.z += f.x;
    vec3 n = normalize(vec3(-f.y, -f.z, 1.0));
    vNormal = normalize(normalMatrix * n);
    vec4 world = modelMatrix * vec4(p, 1.0);
    vPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform vec3 uBase;
  uniform vec3 uDeep;
  uniform vec3 uGold;
  uniform vec3 uSoftGold;
  varying vec3 vNormal;
  varying vec3 vPos;
  varying vec2 vUv;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(cameraPosition - vPos);
    if (dot(n, v) < 0.0) n = -n;

    vec3 keyDir = normalize(vec3(-0.45, 0.55, 0.7));
    vec3 fillDir = normalize(vec3(0.8, -0.35, 0.5));
    float key = max(dot(n, keyDir), 0.0);
    float fill = max(dot(n, fillDir), 0.0);
    vec3 h = normalize(keyDir + v);
    // satin: a tight highlight plus a broad soft sheen
    float spec = pow(max(dot(n, h), 0.0), 42.0);
    float broad = pow(max(dot(n, h), 0.0), 8.0);
    float rim = pow(1.0 - max(dot(n, v), 0.0), 2.5);

    vec3 col = mix(uDeep, uBase, pow(key, 1.25));
    col += uGold * (spec * 0.7 + broad * 0.2);
    col += uSoftGold * rim * 0.12 * key;
    col += uBase * fill * 0.22;

    float vig = smoothstep(0.75, 0.1, distance(vUv, vec2(0.56, 0.5)));
    col *= 0.5 + 0.5 * vig;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Cloth({ onReady, palette }: { onReady: () => void; palette: FabricPalette }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const target = useRef(new THREE.Vector2(0, 0));
  const strength = useRef(0);
  const ready = useRef(false);
  const { viewport, size } = useThree();
  const segments = size.width < 1200 ? 160 : 240;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStrength: { value: 0 },
      uBase: { value: new THREE.Color(palette.base) },
      uDeep: { value: new THREE.Color(palette.deep) },
      uGold: { value: new THREE.Color(palette.highlight) },
      uSoftGold: { value: new THREE.Color(palette.sheen) },
    }),
    [palette],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * viewport.width * 1.1;
      const y = -(e.clientY / window.innerHeight - 0.5) * viewport.height * 1.1;
      target.current.set(x, y);
      strength.current = 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [viewport.width, viewport.height]);

  useFrame((_, delta) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uTime.value += Math.min(delta, 0.05);
    (u.uPointer.value as THREE.Vector2).lerp(target.current, 0.05);
    strength.current *= 0.985;
    u.uPointerStrength.value += (strength.current - u.uPointerStrength.value) * 0.05;
    if (!ready.current) {
      ready.current = true;
      requestAnimationFrame(onReady);
    }
  });

  return (
    <mesh rotation={[-0.38, 0.05, -0.22]} position={[0.3, 0, 0]}>
      <planeGeometry args={[viewport.width * 2.2, viewport.height * 2.6, segments, Math.round(segments * 0.7)]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}

/** Renders only while visible and the tab is active. */
export default function FabricCanvas({ onReady, onError, palette = palettes.navySatin }: { onReady: () => void; onError: () => void; palette?: FabricPalette }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let visible = true;
    const sync = () => setActive(visible && document.visibilityState === "visible");
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 6], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(palette.clear);
          gl.domElement.addEventListener("webglcontextlost", onError, { once: true });
        }}
        aria-hidden="true"
      >
        <Cloth onReady={onReady} palette={palette} />
      </Canvas>
    </div>
  );
}
