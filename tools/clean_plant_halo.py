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


def clean_image(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    cleaned = []
    for red, green, blue, alpha in rgba.getdata():
        if alpha == 0:
            cleaned.append((0, 0, 0, 0))
            continue

        if alpha < 255:
            red = dewhite_channel(red, alpha)
            green = dewhite_channel(green, alpha)
            blue = dewhite_channel(blue, alpha)

            edge_bright = red >= 232 and green >= 232 and blue >= 232
            if edge_bright and alpha < 245:
                alpha = int(alpha * 0.12)
            elif edge_bright:
                alpha = int(alpha * 0.35)

        cleaned.append((red, green, blue, alpha))

    rgba.putdata(cleaned)
    return rgba


for file_name in FILES:
    path = ROOT / file_name
    if not path.exists():
        continue
    image = Image.open(path)
    clean_image(image).save(path)
