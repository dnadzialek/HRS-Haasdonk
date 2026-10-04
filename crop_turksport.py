from PIL import Image
import sys

try:
    img = Image.open('C:/Users/dnadz/.gemini/antigravity/brain/e694a79a-b7fc-4e02-b1c4-aca2a408df38/.user_uploaded/media_1791098536319.jpg')
    width, height = img.size

    # The left logo is around 25% of width, 18% of height
    box_size = int(width * 0.25)
    x_center = int(width * 0.22)
    y_center = int(height * 0.17)

    box = (
        x_center - box_size // 2,
        y_center - box_size // 2,
        x_center + box_size // 2,
        y_center + box_size // 2
    )

    cropped = img.crop(box)
    cropped.save('public/images/turksport.png')
    print("Cropped successfully")
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
