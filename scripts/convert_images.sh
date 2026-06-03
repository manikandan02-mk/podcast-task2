#!/usr/bin/env bash
# scripts/convert_images.sh
# Converts all GIF/JPG source assets to PNG and places them in the correct directories.
# Requirements: ImageMagick (sudo apt install imagemagick  OR  brew install imagemagick)

set -e

SRC_DIR="./source_assets"          # Put your original uploaded files here
FRONTEND_ASSETS="./frontend/src/assets"
BACKEND_THUMBS="./backend/uploads/thumbnails"

mkdir -p "$FRONTEND_ASSETS" "$BACKEND_THUMBS"

echo "▶ Converting images..."

convert_if_exists() {
  local src="$1"
  local out_name="$2"

  if [ -f "$SRC_DIR/$src" ]; then
    # [0] extracts first frame if animated GIF
    convert "$SRC_DIR/$src[0]" "$FRONTEND_ASSETS/$out_name"
    cp "$FRONTEND_ASSETS/$out_name" "$BACKEND_THUMBS/$out_name"
    echo "  ✓ $src → $out_name"
  else
    echo "  ✗ Missing: $src"
  fi
}

# Logo (JPG → PNG)
convert_if_exists "animal_planet_logo.jpg"  "animal_planet_logo.png"

# Icons (already PNG – just copy)
for icon in logout_icon.png edit_icon.png delete_icon.png attachment_icon.png; do
  if [ -f "$SRC_DIR/$icon" ]; then
    cp "$SRC_DIR/$icon" "$FRONTEND_ASSETS/$icon"
    echo "  ✓ $icon (copied)"
  fi
done

# Podcast thumbnails (GIF → PNG)
convert_if_exists "ima_03__1_.gif"  "ima_03.png"
convert_if_exists "ima_05.gif"      "ima_05.png"
convert_if_exists "ima_07.gif"      "ima_07.png"
convert_if_exists "ima_12.gif"      "ima_12.png"
convert_if_exists "ima_13.gif"      "ima_13.png"
convert_if_exists "ima_14.gif"      "ima_14.png"
convert_if_exists "ima_18.gif"      "ima_18.png"
convert_if_exists "ima_19.gif"      "ima_19.png"

# ima_20 is JPG
convert_if_exists "ima_20.jpg"      "ima_20.png"

echo ""
echo "✅ Done. Check $FRONTEND_ASSETS and $BACKEND_THUMBS"
echo ""
echo "Next: place a sample audio file at backend/uploads/audio/sample.mp3"
echo "      then import database/schema.sql into MySQL."
