/**
 * ロゴの案で使う書体（Google Fonts）
 *
 * next/font で読み込むので、書体ファイルは Google ではなくこのサイト自身から配信される。
 * preload: false にしているため、実際に使われた案の書体だけがダウンロードされる
 * （ページを開くたびに全部の書体を読み込むことはない）。
 */
import {
  Alfa_Slab_One,
  Archivo_Black,
  Fredoka,
  IBM_Plex_Mono,
  Playfair_Display,
} from "next/font/google";

export const alfaSlab = Alfa_Slab_One({
  weight: "400",
  subsets: ["latin"],
  preload: false,
  variable: "--logo-font-slab",
});

export const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  preload: false,
  variable: "--logo-font-black",
});

export const fredoka = Fredoka({
  weight: "700",
  subsets: ["latin"],
  preload: false,
  variable: "--logo-font-round",
});

export const playfairItalic = Playfair_Display({
  weight: "900",
  style: "italic",
  subsets: ["latin"],
  preload: false,
  variable: "--logo-font-italic",
});

export const plexMono = IBM_Plex_Mono({
  weight: "500",
  subsets: ["latin"],
  preload: false,
  variable: "--logo-font-mono",
});

// ロゴの外枠に付けるクラス（書体の変数を定義するだけ。使わない書体はダウンロードされない）
export const logoFontVariables = [
  alfaSlab.variable,
  archivoBlack.variable,
  fredoka.variable,
  playfairItalic.variable,
  plexMono.variable,
].join(" ");
