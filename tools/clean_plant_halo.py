from pathlib import Path

from PIL import Image


ROOT = Path(r"C:\Users\lesci\Documents\Aquariow\assets\plants\Nouveaux")
FILES = [
    "Anubias nana.png",
    "Fougère de Java.png",
    "Fougere-de-Java.png",
    "Cryptocoryne wendtii.png",
    "Vallisneria spiralis.png",
    "Echinodorus bleheri.png",
]


def dewhite_channel(channel: int, alpha: int) -> int:
    if alpha <= 0:
        return channel
    corrected = round((channel - (255 - alpha)) * 255 / alpha)
    return max(0, min(255, corrected))


def average_neighbor_color(source, x: int, y: int, width: int, height: int):
    total_weight = 0.0
    total_red = 0.0
    total_green = 0.0
    total_blue = 0.0
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            if dx == 0 and dy == 0:
                continue
            nx = x + dx
            ny = y + dy
            if nx < 0 or ny < 0 or nx >= width or ny >= height:
                continue
            red, green, blue, alpha = source[nx, ny]
            if alpha < 180:
                continue
            weight = alpha / 255.0 / (abs(dx) + abs(dy) + 1)
            total_weight += weight
            total_red += red * weight
            total_green += green * weight
            total_blue += blue * weight
    if total_weight <= 0:
        return None
    return (
        round(total_red / total_weight),
        round(total_green / total_weight),
        round(total_blue / total_weight),
    )


def clean_image(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    source = rgba.load()
    width, height = rgba.size
    cleaned = Image.new("RGBA", rgba.size)
    target = cleaned.load()

    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = source[x, y]
            if alpha == 0:
                target[x, y] = (0, 0, 0, 0)
                continue

            if alpha < 255:
                bright = (red + green + blue) / 3
                red = dewhite_channel(red, alpha)
                green = dewhite_channel(green, alpha)
                blue = dewhite_channel(blue, alpha)

                if bright >= 175:
                    neighbor = average_neighbor_color(source, x, y, width, height)
                    if neighbor is not None:
                        red, green, blue = neighbor

                cleaned_brightness = (red + green + blue) / 3
                if bright >= 190 and alpha < 235:
                    alpha = int(alpha * 0.18)
                elif cleaned_brightness >= 220 and alpha < 245:
                    alpha = int(alpha * 0.34)

            target[x, y] = (red, green, blue, alpha)

    return cleaned


for file_name in FILES:
    path = ROOT / file_name
    if not path.exists():
        continue
    image = Image.open(path)
    clean_image(image).save(path)
