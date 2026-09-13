#!/usr/bin/env python3
"""Build a self-contained, offline copy of one map edition.

The live map (map.html) loads its edition manifest and data packs as
separate files. A snapshot inlines all of them into a single HTML file
that opens from disk with no server and no network: the personal monthly
snapshots, and the base for any off-internet edition.

Usage (from the Mapping clone root):
    python3 scripts/build_map_snapshot.py                 -> public edition
    python3 scripts/build_map_snapshot.py analyst OUT.html
    python3 scripts/build_map_snapshot.py public OUT.html --title "Ransomware Ecosystem v3.8"

The analytics beacon is always stripped from a snapshot.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAP = ROOT / "map.html"
MANIFEST = ROOT / "data" / "map-manifests.js"
PACKS = ROOT / "data" / "packs"


def manifest_editions():
    """Read the edition table out of the manifest file without a JS engine."""
    src = MANIFEST.read_text()
    body = src[src.index("window.MAP_MANIFESTS = ") + len("window.MAP_MANIFESTS = "):]
    body = body[: body.rindex("};") + 1]
    # the manifest is written as JSON-compatible JS: quote bare keys, drop comments
    body = re.sub(r"/\*.*?\*/", "", body, flags=re.S)
    body = re.sub(r"([{,]\s*)([A-Za-z_][A-Za-z0-9_-]*)\s*:", r'\1"\2":', body)
    body = body.replace("'", '"')
    body = re.sub(r",(\s*[}\]])", r"\1", body)
    return json.loads(body)


def resolve(editions, name, depth=0):
    e = editions[name]
    base = resolve(editions, e["extends"], depth + 1) if e.get("extends") and depth < 5 else {}
    out = dict(base)
    for k, v in e.items():
        if k in ("controls", "menus"):
            out[k] = {**base.get(k, {}), **v}
        elif k != "extends":
            out[k] = v
    return out


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    edition = args[0] if args else "public"
    out = pathlib.Path(args[1]) if len(args) > 1 else ROOT / f"ransomware-ecosystem-{edition}-snapshot.html"
    title = None
    if "--title" in sys.argv:
        title = sys.argv[sys.argv.index("--title") + 1]

    m = manifest_editions()
    if edition not in m["editions"]:
        raise SystemExit(f"unknown edition {edition!r}; known: {', '.join(m['editions'])}")
    ed = resolve(m["editions"], edition)

    html = MAP.read_text()
    tag = re.search(r'<script src="data/map-manifests\.js[^"]*"></script>', html)
    if not tag:
        raise SystemExit("map.html changed shape: manifest script tag not found")
    inline = ["<script>\n" + MANIFEST.read_text() + "\n</script>"]
    for p in ed["packs"]:
        src = (PACKS / f"{p}.js").read_text()
        if "</script" in src.lower():
            raise SystemExit(f"pack {p} contains a closing script tag; cannot inline")
        inline.append(f"<script>\n{src}\n</script>")
    # JSON the shell would otherwise fetch at runtime (the analyst edition's live
    # register and trackers) travels inside the snapshot so it works from disk.
    inline_json = {}
    for p in ed["packs"]:
        src = (PACKS / f"{p}.js").read_text()
        for url in re.findall(r"""(?:registerUrl|enforcementUrl|scoreboardUrl):\s*['"]([^'"]+)['"]""", src):
            f = ROOT / url
            if f.exists():
                inline_json[url] = json.loads(f.read_text())
    if inline_json:
        blob = json.dumps(inline_json).replace("</", "<\\/")
        inline.append("<script>window.MAP_INLINE_JSON = " + blob + ";</script>")
    html = html.replace(tag.group(0), "\n".join(inline), 1)
    html = html.replace('<html lang="en">', f'<html lang="en" data-inlined="true" data-edition="{edition}">', 1)
    html = re.sub(r'<script[^>]*gc\.zgo\.at[^>]*>\s*</script>\s*', "", html)
    if title:
        html = html.replace('<span id="map-title">Ransomware Ecosystem v3.0</span>', f'<span id="map-title">{title}</span>', 1)
    if re.search(r'<script src="data/[A-Za-z0-9_./-]+(\?v=[^"]*)?"', html):
        raise SystemExit("a data script tag survived inlining")
    out.write_text(html)
    print(f"wrote {out} ({out.stat().st_size:,} bytes), edition {edition}, packs {', '.join(ed['packs'])}")


if __name__ == "__main__":
    main()
