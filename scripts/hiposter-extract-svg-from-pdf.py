#!/usr/bin/env python3
"""
Extract vector paths from a PDF page and write SVG outputs.

Requires: pypdf
  python3 -m venv /tmp/pdfvec-env
  /tmp/pdfvec-env/bin/pip install pypdf
  /tmp/pdfvec-env/bin/python scripts/hiposter-extract-svg-from-pdf.py \
    "/Users/callumflack/Downloads/HiPoster_A3_FA01.pdf"
"""

from __future__ import annotations

import math
import os
import sys
from pathlib import Path

try:
    from pypdf import PdfReader
    from pypdf.generic import ContentStream
except Exception as error:
    print("Missing dependency: pypdf", file=sys.stderr)
    print("Install with: pip install pypdf", file=sys.stderr)
    raise SystemExit(1) from error


def mult(m1, m2):
    a, b, c, d, e, f = m1
    g, h, i, j, k, l = m2
    return (
        a * g + c * h,
        b * g + d * h,
        a * i + c * j,
        b * i + d * j,
        a * k + c * l + e,
        b * k + d * l + f,
    )


def apply(m, x, y):
    a, b, c, d, e, f = m
    return (a * x + c * y + e, b * x + d * y + f)


def cmyk_to_rgb(c, m, y, k):
    return ((1 - c) * (1 - k), (1 - m) * (1 - k), (1 - y) * (1 - k))


def rgb_css(rgb):
    r, g, b = rgb
    return f"rgb({round(r * 255)},{round(g * 255)},{round(b * 255)})"


def write_svg(path, width, height, paths):
    lines = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<rect width="100%" height="100%" fill="white"/>',
    ]
    for d, paint in paths:
        lines.append(
            f'<path d="{d}" fill="{paint["fill"]}" stroke="{paint["stroke"]}" stroke-width="{paint["stroke_width"]:.3f}"/>'
        )
    lines.append("</svg>")
    path.write_text("\n".join(lines), encoding="utf8")


def extract(pdf_path: Path, output_dir: Path, footer_cutoff_svg_y: float):
    reader = PdfReader(str(pdf_path))
    page = reader.pages[0]
    width = float(page.mediabox.width)
    height = float(page.mediabox.height)
    stream = ContentStream(page.get_contents(), reader)

    ctm = (1.0, 0.0, 0.0, 1.0, 0.0, 0.0)
    stack = []
    fill_rgb = (0.0, 0.0, 0.0)
    stroke_rgb = (0.0, 0.0, 0.0)
    line_width = 1.0
    in_text = False

    tokens = []
    points = []
    all_paths = []

    def to_svg_xy(x, y):
        return x, height - y

    def flush_path(paint_fill: bool, paint_stroke: bool):
        nonlocal tokens, points
        if not tokens or not points:
            tokens = []
            points = []
            return
        xs = [p[0] for p in points]
        ys = [p[1] for p in points]
        bbox = (min(xs), min(ys), max(xs), max(ys))
        paint = {
            "fill": rgb_css(fill_rgb) if paint_fill else "none",
            "stroke": rgb_css(stroke_rgb) if paint_stroke else "none",
            "stroke_width": line_width,
        }
        all_paths.append((" ".join(tokens), bbox, paint))
        tokens = []
        points = []

    for operands, operator in stream.operations:
        op = operator.decode("latin1")
        if op == "q":
            stack.append((ctm, fill_rgb, stroke_rgb, line_width, in_text))
        elif op == "Q":
            if stack:
                ctm, fill_rgb, stroke_rgb, line_width, in_text = stack.pop()
        elif op == "cm":
            m = tuple(float(v) for v in operands)
            ctm = mult(ctm, m)
        elif op == "BT":
            in_text = True
        elif op == "ET":
            in_text = False
        elif op in {"k", "K"}:
            c, m, y, k = [float(v) for v in operands]
            rgb = cmyk_to_rgb(c, m, y, k)
            if op == "k":
                fill_rgb = rgb
            else:
                stroke_rgb = rgb
        elif op == "g":
            g = float(operands[0])
            fill_rgb = (g, g, g)
        elif op == "G":
            g = float(operands[0])
            stroke_rgb = (g, g, g)
        elif op == "w":
            line_width = float(operands[0])
        elif in_text:
            continue
        elif op == "m":
            x, y = [float(v) for v in operands]
            sx, sy = to_svg_xy(*apply(ctm, x, y))
            tokens.append(f"M {sx:.3f} {sy:.3f}")
            points.append((sx, sy))
        elif op == "l":
            x, y = [float(v) for v in operands]
            sx, sy = to_svg_xy(*apply(ctm, x, y))
            tokens.append(f"L {sx:.3f} {sy:.3f}")
            points.append((sx, sy))
        elif op == "c":
            x1, y1, x2, y2, x3, y3 = [float(v) for v in operands]
            p1 = to_svg_xy(*apply(ctm, x1, y1))
            p2 = to_svg_xy(*apply(ctm, x2, y2))
            p3 = to_svg_xy(*apply(ctm, x3, y3))
            tokens.append(
                f"C {p1[0]:.3f} {p1[1]:.3f} {p2[0]:.3f} {p2[1]:.3f} {p3[0]:.3f} {p3[1]:.3f}"
            )
            points.extend([p1, p2, p3])
        elif op == "h":
            tokens.append("Z")
        elif op in {"f", "f*"}:
            flush_path(paint_fill=True, paint_stroke=False)
        elif op in {"S", "s"}:
            flush_path(paint_fill=False, paint_stroke=True)
        elif op in {"B", "B*", "b", "b*"}:
            flush_path(paint_fill=True, paint_stroke=True)
        elif op == "n":
            tokens = []
            points = []

    output_dir.mkdir(parents=True, exist_ok=True)
    full_svg = output_dir / "hiposter-full-vector.svg"
    art_svg = output_dir / "hiposter-artwork-only.svg"

    full_paths = [(d, paint) for d, _bbox, paint in all_paths]
    art_paths = [(d, paint) for d, bbox, paint in all_paths if bbox[3] < footer_cutoff_svg_y]

    write_svg(full_svg, width, height, full_paths)
    write_svg(art_svg, width, height, art_paths)

    print(f"Input PDF: {pdf_path}")
    print(f"Wrote: {full_svg}")
    print(f"Wrote: {art_svg}")
    print(f"Total paths: {len(full_paths)}")
    print(f"Artwork paths: {len(art_paths)}")
    print(f"Footer cutoff (SVG y max): {footer_cutoff_svg_y}")


def main():
    if len(sys.argv) < 2:
        print(
            "Usage: python scripts/hiposter-extract-svg-from-pdf.py <pdf-path> [output-dir] [footer-cutoff-y]"
        )
        raise SystemExit(1)

    pdf_path = Path(sys.argv[1]).expanduser().resolve()
    output_dir = (
        Path(sys.argv[2]).expanduser().resolve()
        if len(sys.argv) >= 3
        else Path("tmp").resolve()
    )
    footer_cutoff = float(sys.argv[3]) if len(sys.argv) >= 4 else 690.0

    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}", file=sys.stderr)
        raise SystemExit(1)

    extract(pdf_path=pdf_path, output_dir=output_dir, footer_cutoff_svg_y=footer_cutoff)


if __name__ == "__main__":
    main()
