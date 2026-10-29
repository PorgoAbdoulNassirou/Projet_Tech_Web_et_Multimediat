"""
Génère assets/js/geo.js à partir du contour officiel du Burkina Faso.

Source : geoBoundaries (gbOpen, BFA ADM0, version simplifiée), licence ODbL.
Usage  : python tools/build_map.py chemin/vers/adm0.geojson

Le script simplifie le tracé (Douglas-Peucker), puis le projette en
équirectangulaire corrigé par cos(latitude moyenne). Le module produit
expose le chemin SVG, l'anneau projeté pour Three.js et la fonction de
projection, afin que les points des contes tombent exactement au bon endroit.
"""
import json
import math
import sys
from pathlib import Path

WIDTH = 1000
PAD = 24
TOLERANCE = 0.012  # en degrés, environ 1,3 km


def perpendicular(p, a, b):
    if a == b:
        return math.dist(p, a)
    (x, y), (x1, y1), (x2, y2) = p, a, b
    num = abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1)
    return num / math.dist(a, b)


def simplify(points, tol):
    if len(points) < 3:
        return points
    dmax, index = 0.0, 0
    for i in range(1, len(points) - 1):
        d = perpendicular(points[i], points[0], points[-1])
        if d > dmax:
            dmax, index = d, i
    if dmax > tol:
        left = simplify(points[: index + 1], tol)
        right = simplify(points[index:], tol)
        return left[:-1] + right
    return [points[0], points[-1]]


def main(src):
    data = json.loads(Path(src).read_text(encoding="utf-8"))
    ring = data["features"][0]["geometry"]["coordinates"][0]
    ring = simplify([tuple(p) for p in ring], TOLERANCE)

    lons = [p[0] for p in ring]
    lats = [p[1] for p in ring]
    lon_min, lon_max = min(lons), max(lons)
    lat_min, lat_max = min(lats), max(lats)
    k = math.cos(math.radians((lat_min + lat_max) / 2))
    scale = (WIDTH - 2 * PAD) / ((lon_max - lon_min) * k)
    height = round((lat_max - lat_min) * scale + 2 * PAD)

    def project(lon, lat):
        return ((lon - lon_min) * k * scale + PAD, (lat_max - lat) * scale + PAD)

    pts = [project(*p) for p in ring]
    path = "M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + "Z"

    out = f"""// Fichier généré par tools/build_map.py, ne pas modifier à la main.
// Contour : geoBoundaries gbOpen BFA ADM0 (licence ODbL), {len(pts)} points.
export const MAP = {{
  width: {WIDTH},
  height: {height},
  bounds: {{ lonMin: {lon_min:.4f}, lonMax: {lon_max:.4f}, latMin: {lat_min:.4f}, latMax: {lat_max:.4f} }},
  k: {k:.6f},
  scale: {scale:.4f},
  pad: {PAD},
}};

export const OUTLINE_PATH = "{path}";

export const OUTLINE_POINTS = {json.dumps([[round(x, 1), round(y, 1)] for x, y in pts], separators=(",", ":"))};

/** Projette une coordonnée géographique dans le repère de la carte. */
export function project(lon, lat) {{
  return [
    (lon - MAP.bounds.lonMin) * MAP.k * MAP.scale + MAP.pad,
    (MAP.bounds.latMax - lat) * MAP.scale + MAP.pad,
  ];
}}
"""
    dest = Path(__file__).resolve().parent.parent / "assets" / "js" / "geo.js"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(out, encoding="utf-8")
    print(f"{len(ring)} points, {WIDTH}x{height} -> {dest}")


if __name__ == "__main__":
    main(sys.argv[1])
