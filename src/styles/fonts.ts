import localFont from "next/font/local";

export const outfitFont = localFont({
  preload: false,
  src: [
    {
      path: "../../public/fonts/outfit.ttf",
    },
  ],
  variable: "--font-outfit",
});
