"""Build the cumulative trail sprite and the nine-frame QA storyboard.

The visible trail and star remain the approved raster assets. This script only
derives temporal frames from their alpha channels so the animation is
reproducible instead of being approximated by hand in the browser.
"""

from __future__ import annotations

from math import hypot
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
QA = ROOT.parent / "docs" / "design" / "qa"

FRAME_COUNT = 32
# One frame matches the largest CSS slot exactly. Keeping the 32-frame atlas
# below 4096 px avoids texture tiling on lower-end mobile GPUs.
FRAME_WIDTH = 118
FRAME_HEIGHT = 104

TRAIL_COLOR = (53, 80, 43, 255)
STAR_COLOR = (189, 211, 47, 255)
BOARD_BG = (247, 245, 237, 255)
BOARD_INK = (83, 91, 76, 255)


def fitted_alpha(path: Path, width: int, height: int, scale_x: float, scale_y: float) -> Image.Image:
    source = Image.open(path).convert("RGBA").getchannel("A")
    fitted = source.resize(
        (round(width * scale_x), round(height * scale_y)),
        Image.Resampling.LANCZOS,
    )
    left = (fitted.width - width) // 2
    top = (fitted.height - height) // 2
    return fitted.crop((left, top, left + width, top + height))


def centerline(alpha: Image.Image) -> list[tuple[float, float]]:
    pixels = alpha.load()
    points: list[tuple[float, float]] = []
    for x in range(alpha.width):
        total = 0
        weighted_y = 0
        for y in range(alpha.height):
            value = pixels[x, y]
            if value >= 8:
                total += value
                weighted_y += value * y
        if total:
            points.append((float(x), weighted_y / total))

    smoothed: list[tuple[float, float]] = []
    radius = 3
    for index, (x, _) in enumerate(points):
        start = max(0, index - radius)
        end = min(len(points), index + radius + 1)
        smoothed.append((x, sum(point[1] for point in points[start:end]) / (end - start)))
    return smoothed


def sample_equal_distance(points: list[tuple[float, float]], count: int) -> list[tuple[float, float]]:
    distances = [0.0]
    for first, second in zip(points, points[1:]):
        distances.append(distances[-1] + hypot(second[0] - first[0], second[1] - first[1]))

    sampled: list[tuple[float, float]] = []
    cursor = 1
    for index in range(count):
        target = distances[-1] * index / (count - 1)
        while cursor < len(distances) - 1 and distances[cursor] < target:
            cursor += 1
        before = cursor - 1
        span = distances[cursor] - distances[before]
        ratio = 0.0 if span == 0 else (target - distances[before]) / span
        sampled.append(
            (
                points[before][0] + (points[cursor][0] - points[before][0]) * ratio,
                points[before][1] + (points[cursor][1] - points[before][1]) * ratio,
            )
        )
    return sampled


def revealed(alpha: Image.Image, lead_x: float, first: bool, last: bool) -> Image.Image:
    if first:
        return Image.new("L", alpha.size, 0)
    if last:
        return alpha.copy()

    source = alpha.load()
    result = Image.new("L", alpha.size, 0)
    target = result.load()
    feather = 7.0
    for y in range(alpha.height):
        for x in range(alpha.width):
            distance = lead_x - x
            factor = max(0.0, min(1.0, (distance + feather) / (feather * 2)))
            target[x, y] = round(source[x, y] * factor)
    return result


def colored(alpha: Image.Image, color: tuple[int, int, int, int]) -> Image.Image:
    layer = Image.new("RGBA", alpha.size, color)
    layer.putalpha(alpha)
    return layer


def star_alpha(width: int = 48, height: int = 48) -> Image.Image:
    return fitted_alpha(ASSETS / "polaris-star-mask.png", width, height, 2.22, 1.88)


def build() -> None:
    QA.mkdir(parents=True, exist_ok=True)

    trail = fitted_alpha(
        ASSETS / "meteor-trail-mask.png",
        FRAME_WIDTH,
        FRAME_HEIGHT,
        1.08,
        1.08,
    )
    path = centerline(trail)
    frame_heads = sample_equal_distance(path, FRAME_COUNT)

    sprite = Image.new("RGBA", (FRAME_WIDTH * FRAME_COUNT, FRAME_HEIGHT), (255, 255, 255, 0))
    trail_frames: list[Image.Image] = []
    for index, (head_x, _) in enumerate(frame_heads):
        alpha = revealed(trail, head_x, index == 0, index == FRAME_COUNT - 1)
        trail_frames.append(alpha)
        sprite.alpha_composite(colored(alpha, (255, 255, 255, 255)), (index * FRAME_WIDTH, 0))
    sprite.save(ASSETS / "meteor-trail-frames.png", optimize=True)

    # The star's centre travels beside the trail head so its left point stays
    # attached to the curve. The nine positions are equally spaced by arc
    # length and become the CSS anchor frames.
    anchors_native = sample_equal_distance(path, 9)
    scale_x = 118 / FRAME_WIDTH
    scale_y = 104 / FRAME_HEIGHT
    anchors = [(x * scale_x + 24, y * scale_y) for x, y in anchors_native]
    end_x, end_y = anchors[-1]
    translations = [(x - end_x, y - end_y) for x, y in anchors]
    scales = (0.22, 0.34, 0.48, 0.62, 0.75, 0.86, 0.94, 0.98, 1.0)
    opacities = (0.0, 0.08, 0.22, 0.42, 0.64, 0.82, 0.94, 0.985, 1.0)

    panel_width = 280
    panel_height = 180
    board = Image.new("RGBA", (panel_width * 3, panel_height * 3), BOARD_BG)
    draw = ImageDraw.Draw(board)
    base_star = star_alpha()
    for index, ((move_x, move_y), scale, opacity) in enumerate(zip(translations, scales, opacities)):
        column = index % 3
        row = index // 3
        panel_x = column * panel_width
        panel_y = row * panel_height
        mark_x = panel_x + 70
        mark_y = panel_y + 42

        trail_index = round(index * (FRAME_COUNT - 1) / 8)
        trail_layer = colored(trail_frames[trail_index].resize((118, 104), Image.Resampling.LANCZOS), TRAIL_COLOR)
        board.alpha_composite(trail_layer, (mark_x, mark_y))

        if opacity > 0:
            size = max(1, round(48 * scale))
            scaled_star = base_star.resize((size, size), Image.Resampling.LANCZOS)
            scaled_star = scaled_star.point(lambda value: round(value * opacity))
            star_layer = colored(scaled_star, STAR_COLOR)
            star_x = round(mark_x + 76 + move_x + 24 - size / 2)
            star_y = round(mark_y - 6 + move_y + 24 - size / 2)
            board.alpha_composite(star_layer, (star_x, star_y))

        milliseconds = round(index * 580 / 8)
        draw.text((panel_x + 16, panel_y + 14), f"{index + 1:02d}  {milliseconds} ms", fill=BOARD_INK)
        if column < 2:
            draw.line((panel_x + panel_width - 1, panel_y + 14, panel_x + panel_width - 1, panel_y + panel_height - 14), fill=(218, 220, 207, 255))
        if row < 2:
            draw.line((panel_x + 14, panel_y + panel_height - 1, panel_x + panel_width - 14, panel_y + panel_height - 1), fill=(218, 220, 207, 255))

    board.save(QA / "logo-motion-frameboard.png", optimize=True)

    position_before = QA / "logo-fade-before.png"
    position_after = QA / "logo-fade-after.png"
    if position_before.exists() and position_after.exists():
        position_comparison = Image.new("RGBA", (388, 196), BOARD_BG)
        position_draw = ImageDraw.Draw(position_comparison)
        before = Image.open(position_before).convert("RGBA").crop((32, 88, 212, 258))
        after = Image.open(position_after).convert("RGBA").crop((32, 88, 212, 258))
        position_comparison.alpha_composite(before, (4, 22))
        position_comparison.alpha_composite(after, (204, 22))
        position_draw.text((8, 6), "BEFORE · CURRENT ANCHOR", fill=BOARD_INK)
        position_draw.text((208, 6), "AFTER · 10 PX LEFT", fill=BOARD_INK)
        position_draw.line((194, 4, 194, 192), fill=(218, 220, 207, 255))
        position_comparison.save(QA / "logo-fade-position-comparison.png", optimize=True)

    print("CSS anchor translations for the 118x104 hero mark:")
    for index, (move_x, move_y) in enumerate(translations):
        print(f"{index * 12.5:5.1f}%  x={move_x:6.1f}px  y={move_y:6.1f}px")


if __name__ == "__main__":
    build()
