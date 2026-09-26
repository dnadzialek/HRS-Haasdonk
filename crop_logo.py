from PIL import Image

# Open the uploaded screenshot
img = Image.open('C:/Users/dnadz/.gemini/antigravity/brain/e694a79a-b7fc-4e02-b1c4-aca2a408df38/.user_uploaded/media_1790412364225.jpg')

# The image is typical mobile screenshot (e.g. 1170x2532 or similar ratio)
# Let's crop roughly where the first logo is based on typical layout.
# Home team is on the left.
width, height = img.size
# X center of left logo is around 25% of width.
# Y center of logos is around 18% of height.
# Let's crop a box of width*0.3 around that center.

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

# Try to find exactly bounding box if it has white background
# But just saving it is fine for now
cropped.save('public/images/melsele.png')
