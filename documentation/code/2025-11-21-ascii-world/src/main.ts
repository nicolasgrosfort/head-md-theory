import { SVG } from "@svgdotjs/svg.js";

const app = document.getElementById("app");
const upload = document.getElementById("upload") as HTMLInputElement;
const widthInput = document.getElementById("widthInput") as HTMLInputElement;
const heightInput = document.getElementById("heightInput") as HTMLInputElement;
const resolutionInput = document.getElementById(
  "resolutionInput"
) as HTMLInputElement;
const fontFileInput = document.getElementById(
  "fontFileInput"
) as HTMLInputElement;

let currentImg: HTMLImageElement | null = null;
let currentFontFamily = "monospace";
let filename = "cambam-stick-4.ttf";

// Characters from "hello, world!" sorted roughly by density (light to dark)
const DENSITY = revert(" ,r!loedhw");

fontFileInput.addEventListener("change", async () => {
  filename = fontFileInput.value.trim();
  if (!filename) {
    currentFontFamily = "monospace";
    processImage();
    return;
  }

  try {
    const fontName = "CustomFont";
    const fontUrl = `/fonts/${filename}`;
    const fontFace = new FontFace(fontName, `url(${fontUrl})`);
    const loadedFace = await fontFace.load();
    document.fonts.add(loadedFace);
    currentFontFamily = fontName;
    processImage();
  } catch (err) {
    console.error("Failed to load font:", err);
    alert(`Failed to load font: ${filename}`);
  }
});

upload.addEventListener("change", (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        currentImg = img;
        processImage();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
});

[widthInput, heightInput, resolutionInput].forEach((input) => {
  input.addEventListener("change", () => processImage());
});

function processImage() {
  if (!currentImg) return;
  const img = currentImg;

  // Clear previous SVG
  if (app) app.innerHTML = "";

  const resolution = parseInt(resolutionInput.value) || 100;
  const aspectRatio = img.height / img.width;
  // Font aspect ratio correction (approx 0.6)
  const height = Math.floor(resolution * aspectRatio * 0.6);
  const width = resolution;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  const draw = SVG()
    .addTo("#app")
    .size(widthInput.value || "100%", heightInput.value || "100%");

  // Set viewBox to match the grid
  draw.viewbox(0, 0, width * 10, height * 16); // Assuming approx 10x16 font size

  // Background
  draw.rect(width * 10, height * 16).fill("#000");

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const r = pixels[offset];
      const g = pixels[offset + 1];
      const b = pixels[offset + 2];

      // Calculate brightness
      const brightness = (r + g + b) / 3;

      // Map brightness to character
      const charIndex = Math.floor((brightness / 255) * (DENSITY.length - 1));
      const char = DENSITY[charIndex];

      if (char !== " ") {
        draw
          .text(char)
          .move(x * 10, y * 16)
          .font({
            family: currentFontFamily,
            size: 16,
            fill: null,
            stroke: "#fff",
          });
      }
    }
  }
}

function revert(chaine: string): string {
  return chaine.split("").reverse().join("");
}
