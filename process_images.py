import os
import sys
import subprocess

SRC_DIR = "/Users/mayank/Downloads/photos"
DEST_DIR = "/Users/mayank/Downloads/photos/sanjali_retrospective_site/assets/images"
os.makedirs(DEST_DIR, exist_ok=True)

# Mapping dictionary: slot_id -> filename in /Users/mayank/Downloads/photos
# e.g. mapping = {"cover-hero": "IMG_2388.HEIC", "eyes-childhood": "IMG_1262.heic"}

def optimize_image(src_filename, dest_basename, max_dimension=1600, quality=82):
    src_path = os.path.join(SRC_DIR, src_filename)
    if not os.path.exists(src_path):
        print(f"File not found: {src_path}", file=sys.stderr)
        return False
        
    dest_path = os.path.join(DEST_DIR, f"{dest_basename}.jpg")
    
    # Use sips to convert HEIC/PNG/JPG to high-quality compressed JPEG
    cmd = [
        "sips",
        "-Z", str(max_dimension),
        "-s", "format", "jpeg",
        "-s", "formatOptions", str(quality),
        src_path,
        "--out", dest_path
    ]
    
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0 and os.path.exists(dest_path):
        orig_size = os.path.getsize(src_path) / 1024
        new_size = os.path.getsize(dest_path) / 1024
        print(f"✓ {src_filename} -> {dest_basename}.jpg ({orig_size:.0f}KB -> {new_size:.0f}KB)")
        return True
    else:
        print(f"Failed to process {src_filename}: {res.stderr}", file=sys.stderr)
        return False

if __name__ == "__main__":
    if len(sys.argv) > 2:
        src = sys.argv[1]
        dest = sys.argv[2]
        optimize_image(src, dest)
