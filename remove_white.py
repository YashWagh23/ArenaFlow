import sys
from PIL import Image

def color_to_alpha_white(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # GIMP's Color to Alpha for White (255, 255, 255)
            # a_c = (255 - c) / 255.0
            a_r = (255 - r) / 255.0
            a_g = (255 - g) / 255.0
            a_b = (255 - b) / 255.0
            
            alpha_max = max(a_r, a_g, a_b)
            
            if alpha_max == 0:
                pixels[x, y] = (255, 255, 255, 0)
            else:
                new_r = max(0, min(255, int((r - 255 * (1 - alpha_max)) / alpha_max)))
                new_g = max(0, min(255, int((g - 255 * (1 - alpha_max)) / alpha_max)))
                new_b = max(0, min(255, int((b - 255 * (1 - alpha_max)) / alpha_max)))
                new_a = int(alpha_max * 255)
                
                # If the original pixel was already transparent, we should preserve its alpha
                final_a = min(a, new_a)
                pixels[x, y] = (new_r, new_g, new_b, final_a)

    img.save(output_path, "PNG")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python remove_white.py <input> <output>")
        sys.exit(1)
    color_to_alpha_white(sys.argv[1], sys.argv[2])
