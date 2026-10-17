import { Image, View } from "react-native";

// The painted orb (brand/watercolor-orb.jpg) cropped to its dot, at any size.
// It is the reference in the lab and the fallback wherever a generated dot is
// not ready or cannot be drawn (FR-010).
const SOURCE = require("../../assets/brand/watercolor-orb.jpg");
const SOURCE_WIDTH = 1000;
const SOURCE_HEIGHT = 740;
// Where the dot sits in the source image, in source pixels.
const CROP = { x: 420, y: 0, size: 270 };

export function PaintedOrb({ size }: { size: number }) {
  const scale = size / CROP.size;
  return (
    <View style={{ width: size, height: size, overflow: "hidden" }}>
      <Image
        source={SOURCE}
        style={{
          position: "absolute",
          left: -CROP.x * scale,
          top: -CROP.y * scale,
          width: SOURCE_WIDTH * scale,
          height: SOURCE_HEIGHT * scale,
        }}
      />
    </View>
  );
}
