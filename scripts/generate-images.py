"""
Procedural textile image library for Sourcing Eleven.

These are art-directed material studies (fabric folds, weaves, swatches,
bolts) rendered with numpy so the site ships with on-brand imagery that
never misrepresents a real facility, product or person. Replace any file in
public/images with licensed or commissioned photography of the same name and
aspect ratio — every reference goes through data/images.ts.

Run:  python3 scripts/generate-images.py
"""
import os
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import gaussian_filter, map_coordinates

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
os.makedirs(OUT, exist_ok=True)


def hex2lin(h):
    h = h.lstrip("#")
    c = np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)])
    return c ** 2.2


NAVY, DEEP = hex2lin("#0B1F39"), hex2lin("#07172B")
GOLD, SOFTGOLD = hex2lin("#C7A365"), hex2lin("#D8BC8C")
IVORY, WHITE = hex2lin("#F7F5F0"), hex2lin("#FFFFFF")
INDIGO, ECRU, SAND = hex2lin("#1E3556"), hex2lin("#E6DDCB"), hex2lin("#CDBB9A")
STONE, SLATE = hex2lin("#B9B4A9"), hex2lin("#3A4A5F")


def smooth_noise(h, w, scale, rng, octaves=1):
    out = np.zeros((h, w))
    amp = 1.0
    for o in range(octaves):
        s = max(2, int(scale / (2 ** o)))
        small = rng.standard_normal((h // s + 3, w // s + 3))
        small = gaussian_filter(small, 1.0)
        yy, xx = np.mgrid[0:h, 0:w]
        out += amp * map_coordinates(small, [yy / s, xx / s], order=3, mode="reflect")
        amp *= 0.5
    return out / (np.abs(out).max() + 1e-9)


def folds(h, w, rng, angle=0.6, n=5, base_freq=2.2, warp=0.9, amp=1.0):
    yy, xx = np.mgrid[0:h, 0:w] / max(h, w)
    wx = smooth_noise(h, w, max(h, w) / 3, rng) * warp
    u = xx * np.cos(angle) + yy * np.sin(angle)
    v = -xx * np.sin(angle) + yy * np.cos(angle)
    field = np.zeros((h, w))
    for i in range(n):
        f = base_freq * (1 + i * 0.55) * rng.uniform(0.8, 1.25)
        a = amp / (1 + i * 1.3)
        ph = rng.uniform(0, 6.28)
        field += a * np.sin(2 * np.pi * f * (u + 0.07 * np.sin(2 * np.pi * v * (0.5 + i * 0.2)) + wx * 0.08) + ph)
    # sharpen fold ridges a little so they read like cloth, not water
    field = np.sign(field) * np.abs(field) ** 0.85
    return field


def weave(h, w, kind, period, rng):
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    P = period
    if kind == "plain":
        a = np.sin(np.pi * xx / P) ** 2
        b = np.sin(np.pi * yy / P) ** 2
        c = (np.floor(xx / P) + np.floor(yy / P)) % 2
        p = np.where(c == 0, a, b)
        warp_mask = c
    elif kind == "twill":
        s = (np.floor(xx / P) + np.floor(yy / P)) % 3
        warp_mask = (s < 2).astype(float)
        a = np.sin(np.pi * (xx + yy * 0.0) / P) ** 2
        b = np.sin(np.pi * yy / P) ** 2
        p = np.where(warp_mask > 0, b ** 0.6, a ** 0.6)
        diag = np.sin(np.pi * (xx + yy) / (P * 1.5)) ** 2
        p = 0.6 * p + 0.4 * diag
    elif kind == "jersey":
        col = np.floor(xx / P)
        fx = (xx / P) - col
        v = np.abs(fx - 0.5) * P * 1.2
        p = np.sin(np.pi * (yy + v) / P) ** 2 * np.sin(np.pi * fx) ** 0.5
        warp_mask = np.zeros_like(p)
    elif kind == "waffle":
        a = np.abs(np.sin(np.pi * xx / P))
        b = np.abs(np.sin(np.pi * yy / P))
        p = 1 - np.minimum(a, b) ** 0.5
        warp_mask = np.zeros_like(p)
    elif kind == "terry":
        n = smooth_noise(h, w, P * 0.8, rng)
        p = (np.sin(np.pi * xx / P) ** 2 * np.sin(np.pi * yy / P) ** 2) * 0.6 + 0.4 * (n * 0.5 + 0.5)
        warp_mask = np.zeros_like(p)
    elif kind == "satin":
        p = np.sin(np.pi * yy / P) ** 2 * 0.3 + 0.7
        warp_mask = np.zeros_like(p)
    elif kind == "slub":
        slub = smooth_noise(h, w, P * 6, rng) * 0.5 + 0.5
        a = np.sin(np.pi * xx / P) ** 2
        b = np.sin(np.pi * yy / (P * (0.8 + 0.4 * slub))) ** 2
        c = (np.floor(xx / P) + np.floor(yy / P)) % 2
        p = np.where(c == 0, a, b)
        warp_mask = c
    else:
        p = np.ones((h, w))
        warp_mask = np.zeros((h, w))
    return p, warp_mask


def shade(height, albedo, key=GOLD, fill=NAVY, key_dir=(-0.55, -0.6, 0.6), strength=55.0,
          shininess=24.0, spec=0.35, ambient=0.18, key_int=1.25, fill_int=0.35):
    gy, gx = np.gradient(height)
    nx, ny, nz = -gx * strength, -gy * strength, np.ones_like(height)
    nl = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
    nx, ny, nz = nx / nl, ny / nl, nz / nl
    L = np.array(key_dir, dtype=float); L /= np.linalg.norm(L)
    F = np.array([0.6, 0.5, 0.6]); F /= np.linalg.norm(F)
    V = np.array([0, 0, 1.0])
    Hh = (L + V); Hh /= np.linalg.norm(Hh)
    d1 = np.clip(nx * L[0] + ny * L[1] + nz * L[2], 0, 1)
    d2 = np.clip(nx * F[0] + ny * F[1] + nz * F[2], 0, 1)
    s1 = np.clip(nx * Hh[0] + ny * Hh[1] + nz * Hh[2], 0, 1) ** shininess
    # cavity occlusion from local height
    occ = 1 - 0.55 * np.clip(-(height - gaussian_filter(height, 18)) * 6, 0, 1)
    col = albedo * (ambient + key_int * d1[..., None] * (0.6 + 0.4 * key) + fill_int * d2[..., None] * (0.5 + fill))
    col = col * occ[..., None] + spec * s1[..., None] * key
    return col


def finish(lin, name, vignette=0.35, grain=0.018, blur_edges=True, quality=88):
    h, w, _ = lin.shape
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    lin = lin * (1 - vignette * np.clip(r - 0.35, 0, 1)[..., None] ** 1.5)
    srgb = np.clip(lin, 0, 1) ** (1 / 2.2)
    rng = np.random.default_rng(len(name))
    srgb = srgb + rng.normal(0, grain, srgb.shape)
    img = Image.fromarray((np.clip(srgb, 0, 1) * 255).astype(np.uint8))
    if blur_edges:
        blurred = img.filter(ImageFilter.GaussianBlur(2.2))
        mask = Image.fromarray((np.clip((r - 0.55) * 1.6, 0, 1) * 255).astype(np.uint8))
        img = Image.composite(blurred, img, mask)
    img.save(os.path.join(OUT, name), "JPEG", quality=quality, optimize=True, progressive=True)
    print("wrote", name, img.size)


def cloth(w, h, seed, base, kind="satin", period=6, angle=0.6, n=5, freq=2.0, fold_amp=1.0,
          strength=55, shininess=24, spec=0.35, key=GOLD, fill=NAVY, ambient=0.18, key_int=1.25,
          warp_color=None, key_dir=(-0.55, -0.6, 0.6), variation=0.08):
    rng = np.random.default_rng(seed)
    hgt = folds(h, w, rng, angle=angle, n=n, base_freq=freq, amp=fold_amp)
    hgt = gaussian_filter(hgt, 1.2) * 1.0
    p, wm = weave(h, w, kind, period, rng)
    micro = (p - 0.5) * 0.012
    alb = np.ones((h, w, 3)) * base
    if warp_color is not None:
        alb = np.where(wm[..., None] > 0, warp_color, base)
    vari = smooth_noise(h, w, 120, rng) * variation
    alb = alb * (0.86 + 0.14 * p[..., None]) * (1 + vari[..., None])
    return shade(hgt + micro, alb, key=key, fill=fill, strength=strength, shininess=shininess,
                 spec=spec, ambient=ambient, key_int=key_int, key_dir=key_dir)


# ---------- composites ----------

def swatch_fan(w, h, seed, bg=IVORY):
    rng = np.random.default_rng(seed)
    canvas = np.ones((h, w, 3)) * bg * 0.92
    canvas = canvas * (0.95 + 0.05 * smooth_noise(h, w, 200, rng)[..., None])
    palette = [(NAVY, "twill"), (ECRU, "slub"), (GOLD, "satin"), (INDIGO, "twill"), (SAND, "plain"),
               (SLATE, "jersey"), (IVORY, "waffle"), (SOFTGOLD, "plain")]
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    cx, cy = w * 0.18, h * 1.15
    for i, (c, kind) in enumerate(palette):
        ang = np.deg2rad(-62 + i * 11.5)
        tex = cloth(w, h, seed + i * 7, c, kind=kind, period=5 + (i % 3), n=3, freq=1.2, fold_amp=0.4,
                    strength=40, spec=0.25)
        # rotated rectangle mask (long swatch radiating from a pivot)
        dx, dy = xx - cx, yy - cy
        along = dx * np.cos(ang) + dy * np.sin(ang)
        across = -dx * np.sin(ang) + dy * np.cos(ang)
        L, W = max(w, h) * 1.25, w * 0.13
        m = ((along > 0) & (along < L) & (np.abs(across) < W)).astype(float)
        m = gaussian_filter(m, 1.2)
        shadow = gaussian_filter(np.roll(np.roll(m, 14, 0), 10, 1), 14) * 0.45
        canvas = canvas * (1 - shadow[..., None])
        canvas = canvas * (1 - m[..., None]) + tex * m[..., None]
    return canvas


def lab_dips(w, h, seed):
    rng = np.random.default_rng(seed)
    canvas = cloth(w, h, seed, IVORY, kind="plain", period=4, n=2, freq=0.8, fold_amp=0.2, strength=20, spec=0.1,
                   ambient=0.4, key_int=1.0)
    cols = [NAVY, INDIGO, SLATE, GOLD, SOFTGOLD, SAND, ECRU, STONE, DEEP, hex2lin("#5B6B7F"), hex2lin("#8F7A55"), hex2lin("#A99271")]
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    cols_n, rows_n = 4, 3
    cw, ch = w * 0.17, h * 0.21
    gx0, gy0 = w * 0.12, h * 0.14
    for r in range(rows_n):
        for c in range(cols_n):
            i = r * cols_n + c
            x0 = gx0 + c * (cw + w * 0.03) + rng.uniform(-6, 6)
            y0 = gy0 + r * (ch + h * 0.06) + rng.uniform(-6, 6)
            m = ((xx > x0) & (xx < x0 + cw) & (yy > y0) & (yy < y0 + ch)).astype(float)
            # pinked edge
            edge = np.sin((xx + yy) / 3.0) * 1.5
            m = ((xx > x0 + edge) & (xx < x0 + cw - edge) & (yy > y0 + edge) & (yy < y0 + ch - edge)).astype(float)
            m = gaussian_filter(m, 0.8)
            sh = gaussian_filter(np.roll(np.roll(m, 8, 0), 6, 1), 8) * 0.35
            tex = cloth(w, h, seed + i, cols[i], kind="plain", period=3, n=2, freq=3, fold_amp=0.2, strength=30, spec=0.15)
            canvas = canvas * (1 - sh[..., None])
            canvas = canvas * (1 - m[..., None]) + tex * m[..., None]
    return canvas


def bolts(w, h, seed):
    """End-on view of fabric bolts stacked in a rack."""
    rng = np.random.default_rng(seed)
    canvas = np.ones((h, w, 3)) * DEEP * 0.6
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    cols = [IVORY, NAVY, GOLD, ECRU, INDIGO, SAND, SLATE, SOFTGOLD, STONE, IVORY, INDIGO, ECRU]
    R = h / 6.2
    k = 0
    for row in range(4):
        for col in range(int(w / (2 * R)) + 2):
            cx = col * 2.02 * R + (R if row % 2 else 0) - R * 0.3 + rng.uniform(-4, 4)
            cy = h - (row * 1.75 * R + R * 1.02)
            rr = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
            th = np.arctan2(yy - cy, xx - cx)
            m = gaussian_filter((rr < R * rng.uniform(0.93, 1.0)).astype(float), 1.0)
            if m.max() < 0.01:
                continue
            c = cols[k % len(cols)]; k += 1
            spiral = np.sin((rr + th / (2 * np.pi) * 7) / 7 * 2 * np.pi) ** 2
            core = (rr < R * 0.16)
            lum = (0.55 + 0.45 * (1 - rr / R)) * (0.8 + 0.2 * spiral)
            light = 0.65 + 0.35 * np.clip(-(xx - cx) / R * 0.6 - (yy - cy) / R * 0.6, -1, 1)
            tex = c * (lum * light)[..., None]
            tex = np.where(core[..., None], DEEP * 0.4, tex)
            canvas = canvas * (1 - m[..., None]) + tex * m[..., None]
    return canvas


def stacks(w, h, seed):
    """Folded textiles stacked, seen from the side."""
    rng = np.random.default_rng(seed)
    canvas = np.ones((h, w, 3)) * IVORY * 0.85
    canvas *= (0.92 + 0.08 * np.linspace(1, 0, h)[:, None, None])
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    cols = [NAVY, IVORY, SAND, INDIGO, ECRU, GOLD, SLATE, WHITE, STONE, NAVY, ECRU, SOFTGOLD, INDIGO, IVORY]
    for s, (x0, x1) in enumerate([(0.06, 0.46), (0.52, 0.94)]):
        y = h * 0.93
        i = 0
        while y > h * 0.12:
            th = h * rng.uniform(0.045, 0.075)
            c = cols[(i + s * 5) % len(cols)]; i += 1
            xa, xb = w * x0 + rng.uniform(-8, 8), w * x1 + rng.uniform(-8, 8)
            t = (yy - (y - th)) / th
            m = ((yy < y) & (yy > y - th) & (xx > xa) & (xx < xb)).astype(float)
            # rounded fold edge at the front
            bulge = np.clip(np.sin(np.clip(t, 0, 1) * np.pi), 0, 1)
            lum = 0.55 + 0.5 * bulge ** 0.7
            lum = lum * (0.92 + 0.08 * np.sin(xx / 9.0))
            tex = c * lum[..., None]
            m = gaussian_filter(m, 0.9)
            canvas = canvas * (1 - m[..., None]) + tex * m[..., None]
            y -= th * 0.98
    sh = gaussian_filter((yy > h * 0.93).astype(float), 10) * 0.35
    return canvas * (1 - sh[..., None])


def warp_threads(w, h, seed, base=NAVY, accent=GOLD):
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    persp = 1 + (yy / h) * 1.8
    P = 7.0
    X = (xx - w / 2) / persp + w / 2
    t = np.sin(np.pi * X / P) ** 2
    idx = np.floor(X / P).astype(int)
    pick = (np.abs(np.sin(idx * 12.9898) * 43758.5453) % 1)
    colr = np.where((pick > 0.93)[..., None], accent, base)
    colr = np.where(((pick > 0.6) & (pick < 0.7))[..., None], base * 1.7, colr)
    lum = 0.35 + 0.9 * t ** 0.7
    light = 0.5 + 0.7 * np.exp(-((yy / h - 0.38) ** 2) / 0.05)
    img = colr * (lum * light)[..., None]
    fade = np.clip((yy / h) * 1.4, 0, 1)
    img = img * (0.25 + 0.75 * fade)[..., None]
    img = img * (0.95 + 0.05 * smooth_noise(h, w, 60, rng))[..., None]
    return img


def loupe(w, h, seed):
    base = cloth(w, h, seed, ECRU, kind="plain", period=3, n=3, freq=1.2, fold_amp=0.3, strength=30, spec=0.15,
                 ambient=0.3)
    mag = cloth(w, h, seed, ECRU, kind="plain", period=26, n=2, freq=0.5, fold_amp=0.15, strength=70, spec=0.3,
                ambient=0.25)
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    cx, cy, R = w * 0.6, h * 0.48, min(w, h) * 0.3
    rr = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    inside = gaussian_filter((rr < R).astype(float), 1.2)
    ring = np.exp(-((rr - R * 1.04) ** 2) / (R * 0.03) ** 2)
    ring_hl = ring * (0.6 + 0.4 * np.clip(-(xx - cx) / R - (yy - cy) / R, -1, 1))
    shadow = gaussian_filter(((rr < R * 1.1)).astype(float), 30) * 0.3
    shadow = np.roll(np.roll(shadow, 30, 0), 24, 1)
    img = base * (1 - shadow[..., None])
    img = img * (1 - inside[..., None]) + mag * 1.08 * inside[..., None]
    glare = np.exp(-(((xx - (cx - R * 0.4)) ** 2 + (yy - (cy - R * 0.45)) ** 2) / (R * 0.35) ** 2)) * inside * 0.12
    img = img + glare[..., None]
    img = img * (1 - ring[..., None]) + (NAVY * 0.6 + GOLD * ring_hl[..., None] * 0.9) * ring[..., None]
    return img


def drafting(w, h, seed):
    img = cloth(w, h, seed, NAVY, kind="twill", period=4, n=3, freq=0.9, fold_amp=0.3, strength=35, spec=0.15,
                ambient=0.22, key_int=1.1)
    yy, xx = np.mgrid[0:h, 0:w].astype(float) / h
    lines = np.zeros(xx.shape)
    # pattern-drafting curves: armhole, hem, grainline
    for (a, b, c, t) in [(0.9, -1.6, 0.95, 0.0016), (0.5, -0.4, 0.45, 0.0014), (0.0, 0.0, 0.62, 0.0011)]:
        y_curve = a * (xx - 0.9) ** 2 + b * 0 + c
        lines += np.exp(-((yy - y_curve) ** 2) / t ** 2 / 2)
    lines += np.exp(-((xx - 1.05) ** 2) / (0.0013 ** 2) / 2) * (yy > 0.15) * (yy < 0.85)
    for k in range(9):
        yk = 0.2 + k * 0.07
        lines += np.exp(-((yy - yk) ** 2 + (xx - 1.05) ** 2) / (0.004 ** 2)) * 2
    dash = (np.sin(xx * 220) > -0.2)
    lines = np.clip(lines, 0, 1) * dash
    return img * (1 - 0.8 * lines[..., None]) + GOLD * 1.1 * lines[..., None]


if __name__ == "__main__":
    W, H = 2400, 1350
    finish(cloth(W, H, 11, NAVY * 1.25, kind="satin", period=3, angle=0.55, n=6, freq=1.5, strength=70,
                 shininess=30, spec=0.55, key_int=1.4), "hero-navy-silk.jpg", vignette=0.5)
    finish(cloth(1600, 2000, 23, IVORY, kind="slub", period=5, angle=1.2, n=5, freq=1.6, strength=45,
                 spec=0.12, ambient=0.3, key_int=1.0, key=SOFTGOLD), "linen-ivory-folds.jpg", vignette=0.25)
    finish(cloth(1600, 1200, 31, GOLD * 1.05, kind="satin", period=3, angle=0.3, n=6, freq=1.8, strength=65,
                 shininess=34, spec=0.5, key=SOFTGOLD, key_int=1.2), "champagne-silk.jpg", vignette=0.4)
    finish(cloth(1600, 1200, 41, INDIGO * 1.2, kind="twill", period=4, angle=0.9, n=5, freq=1.6, strength=55,
                 spec=0.12, warp_color=INDIGO * 1.1, ambient=0.2), "denim-twill.jpg")
    finish(cloth(1600, 1200, 43, WHITE * 0.95, kind="waffle", period=14, angle=0.4, n=4, freq=1.2, strength=40,
                 spec=0.08, ambient=0.32, key=SOFTGOLD, key_int=0.95), "waffle-cotton.jpg", vignette=0.25)
    finish(cloth(1600, 1200, 47, SLATE, kind="jersey", period=7, angle=1.4, n=4, freq=1.3, strength=45,
                 spec=0.1, ambient=0.22), "jersey-knit.jpg")
    finish(cloth(1600, 1200, 53, ECRU, kind="slub", period=4, angle=0.7, n=4, freq=1.0, strength=35, spec=0.08,
                 ambient=0.32, key=SOFTGOLD, key_int=0.95), "undyed-cotton.jpg", vignette=0.25)
    finish(cloth(1600, 1200, 59, SAND, kind="terry", period=6, angle=0.2, n=4, freq=1.1, strength=45, spec=0.05,
                 ambient=0.3, key_int=1.0), "terry-towelling.jpg", vignette=0.3)
    finish(swatch_fan(1600, 1200, 61), "swatch-fan.jpg", vignette=0.25, blur_edges=False)
    finish(lab_dips(1600, 1200, 67), "lab-dips.jpg", vignette=0.2, blur_edges=False)
    finish(bolts(1600, 1200, 71), "fabric-bolts.jpg", vignette=0.35, blur_edges=False)
    finish(stacks(1600, 1200, 73), "folded-stacks.jpg", vignette=0.25, blur_edges=False)
    finish(warp_threads(1600, 1200, 79), "warp-threads.jpg", vignette=0.3)
    finish(loupe(1600, 1200, 83), "inspection-loupe.jpg", vignette=0.25, blur_edges=False)
    finish(drafting(1600, 1200, 89), "pattern-drafting.jpg", vignette=0.3)
    finish(cloth(1600, 1200, 97, DEEP * 1.6, kind="twill", period=4, angle=1.0, n=5, freq=1.4, strength=60,
                 spec=0.3, ambient=0.15, key_int=1.3), "navy-twill.jpg", vignette=0.45)
