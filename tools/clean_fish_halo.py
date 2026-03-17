from pathlib import Path

from PIL import Image


ROOT = Path(r"C:\Users\lesci\Documents\Aquariow\assets\fish\Nouveaux")
FILES = [
    "Guppy.png",
    "Betta.png",
    "Tétra néon.png",
    "Tetra-neon.png",
    "Corydoras.png",
    "Gourami perle.png",
    "Platy.png",
    "Danio rerio.png",
]


def soften_white_halo(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = list(rgba.getdata())
    cleaned = []
    for red, green, blue, alpha in pixels:
      if alpha == 0:
        cleaned.append((red, green, blue, alpha))
        continue

      is_bright = red >= 236 and green >= 236 and blue >= 236
      is_edge = alpha < 252
      if is_bright and is_edge:
        alpha = int(alpha * 0.18)
      elif is_bright and alpha < 255:
        alpha = int(alpha * 0.35)
      cleaned.append((red, green, blue, alpha))

    rgba.putdata(cleaned)
    return rgba


for file_name in FILES:
    path = ROOT / file_name
    if not path.exists():
        continue
    image = Image.open(path)
    cleaned = soften_white_halo(image)
    cleaned.save(path)
