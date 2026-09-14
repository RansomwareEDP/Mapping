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

Options for editions defined outside this repository (an off-internet
build composes on top of the public shell without touching it):
    --edition-file FILE.json   an edition definition {"name": ..., "extends": ..., ...}
                               merged into the manifest before inlining; its name
                               becomes the edition to build
    --pack NAME=FILE.js        an extra pack file to inline (repeatable); it must
                               define MAP_PACKS.NAME like the packs in data/packs
    --append FILE.js           a script appended before </body> (repeatable)
    --prepend FILE.js          a script inserted right after the packs (repeatable)
    --data-attr KEY=VALUE      an attribute added to the <html> element (repeatable)

The analytics beacon is always stripped from a snapshot. The result never
references an external script; the build refuses to write otherwise.
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


def opt_all(flag):
    vals, argv = [], sys.argv
    for i, a in enumerate(argv):
        if a == flag and i + 1 < len(argv):
            vals.append(argv[i + 1])
    return vals


def main():
    argv = sys.argv[1:]
    skip = set()
    for i, a in enumerate(argv):
        if a.startswith("--"):
            skip.add(i); skip.add(i + 1)
    args = [a for i, a in enumerate(argv) if i not in skip]
    edition = args[0] if args else "public"
    out = pathlib.Path(args[1]) if len(args) > 1 else ROOT / f"ransomware-ecosystem-{edition}-snapshot.html"
    title = (opt_all("--title") or [None])[0]

    m = manifest_editions()
    extra_edition = None
    for f in opt_all("--edition-file"):
        extra_edition = json.loads(pathlib.Path(f).read_text())
        name = extra_edition.pop("name")
        m["editions"][name] = extra_edition
        edition = name
    if edition not in m["editions"]:
        raise SystemExit(f"unknown edition {edition!r}; known: {', '.join(m['editions'])}")
    ed = resolve(m["editions"], edition)

    extra_packs = {}
    for spec in opt_all("--pack"):
        name, _, path = spec.partition("=")
        extra_packs[name] = pathlib.Path(path)

    html = MAP.read_text()
    tag = re.search(r'<script src="data/map-manifests\.js[^"]*"></script>', html)
    if not tag:
        raise SystemExit("map.html changed shape: manifest script tag not found")
    manifest_src = MANIFEST.read_text()
    if extra_edition is not None:
        # inject the outside edition into the inlined manifest, in front of the public ones
        marker = "  editions: {\n"
        if marker not in manifest_src:
            raise SystemExit("manifest changed shape: editions block not found")
        manifest_src = manifest_src.replace(marker, marker + f"    {json.dumps(edition)}: {json.dumps(extra_edition)},\n", 1)
    inline = ["<script>\n" + manifest_src + "\n</script>"]
    pack_sources = {}
    for p in ed["packs"]:
        f = extra_packs.get(p, PACKS / f"{p}.js")
        if not f.exists():
            raise SystemExit(f"pack {p} not found at {f}")
        src = f.read_text()
        if "</script" in src.lower():
            raise SystemExit(f"pack {p} contains a closing script tag; cannot inline")
        pack_sources[p] = src
        inline.append(f"<script>\n{src}\n</script>")
    # JSON the shell would otherwise fetch at runtime (the analyst edition's live
    # register and trackers) travels inside the snapshot so it works from disk.
    inline_json = {}
    for src in pack_sources.values():
        for url in sorted(set(re.findall(r"""['"](data/[A-Za-z0-9_./-]+\.json)['"]""", src))):
            f = ROOT / url
            if f.exists():
                inline_json[url] = json.loads(f.read_text())
    if inline_json:
        blob = json.dumps(inline_json).replace("</", "<\\/")
        inline.append("<script>window.MAP_INLINE_JSON = " + blob + ";</script>")
    for f in opt_all("--prepend"):
        src = pathlib.Path(f).read_text()
        if "</script" in src.lower():
            raise SystemExit(f"{f} contains a closing script tag; cannot inline")
        inline.append(f"<script>\n{src}\n</script>")
    html = html.replace(tag.group(0), "\n".join(inline), 1)
    attrs = f' data-inlined="true" data-edition="{edition}"'
    for spec in opt_all("--data-attr"):
        k, _, v = spec.partition("=")
        attrs += f' data-{k}="{v}"'
    html = html.replace('<html lang="en">', f'<html lang="en"{attrs}>', 1)
    html = re.sub(r'<script[^>]*gc\.zgo\.at[^>]*>\s*</script>\s*', "", html)
    if "zgo.at" in html:
        raise SystemExit("analytics beacon still present, refusing to build")
    if title:
        html = html.replace('<span id="map-title">Ransomware Ecosystem v3.0</span>', f'<span id="map-title">{title}</span>', 1)
    for f in opt_all("--append"):
        src = pathlib.Path(f).read_text()
        if "</script" in src.lower():
            raise SystemExit(f"{f} contains a closing script tag; cannot inline")
        html = html.replace("</body>", f"<script>\n{src}\n</script>\n</body>", 1)
    if re.search(r'<script src="[A-Za-z0-9_./:-]+(\?v=[^"]*)?"', html):
        raise SystemExit("build is not self-contained: an external script tag survived")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)
    print(f"wrote {out} ({out.stat().st_size:,} bytes), edition {edition}, packs {', '.join(ed['packs'])}")


if __name__ == "__main__":
    main()
