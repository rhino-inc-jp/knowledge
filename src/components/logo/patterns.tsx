/**
 * 左上ロゴの案の定義（15案。P06・P16 は検証の結果外した。番号は振り直さない）
 *
 * - render：表示する中身（最終形）。動きは logo.module.css の .play で付く
 * - fit：data-fit を付けた要素は、ロゴの横幅 × その値 に収まるよう文字の大きさを合わせる
 * - after：書体の読み込みと大きさ合わせの後に行う追加処理（SVG の枠合わせなど）
 * - fonts：表示前に読み込みを待つ書体（document.fonts.load に渡す指定）
 * - is3d：本物の3D（Three.js）の案
 */
import type { CSSProperties, ReactNode } from "react";
import styles from "./logo.module.css";
import { LOGO_LETTERS, LOGO_SUB, LOGO_VIEWBOX } from "./logoPaths";
import { alfaSlab, archivoBlack, corben, fredoka, playfairItalic, plexMono } from "./fonts";

export type LogoContext = {
  uid: string; // SVG の id が重ならないための文字列
  year: number;
  month: number;
  monthColor: string; // サイトの「今月の色」（記事の行にマウスを乗せたときの色）
};

export type LogoPattern = {
  id: string; // p01〜p17（URL の ?logo=p07 で指定できる。p06・p16 は欠番）
  name: string;
  className: string;
  full?: boolean; // true：下の「Case Study Sharing by Rhino inc.」も中身に含む（今のロゴをそのまま使う案）
  fonts?: string[];
  is3d?: "chrome" | "balloon";
  render: (ctx: LogoContext) => ReactNode;
  after?: (root: HTMLElement) => void;
};

// サイトの「月ごとのホバー色」（Article.tsx と同じ12色）
export const MONTH_COLORS: Record<number, string> = {
  1: "#FF948D", 2: "#FFB995", 3: "#FFD384", 4: "#FFF171", 5: "#CCFF6A", 6: "#92FF8D",
  7: "#99FFD8", 8: "#9AF3FF", 9: "#71C4FF", 10: "#8DA9FF", 11: "#CC8DFF", 12: "#FFA5B8",
};

const font = (spec: string, family: string) => `${spec} 100px ${family}`;
const SLAB = font("400", alfaSlab.style.fontFamily);
const BLACK = font("400", archivoBlack.style.fontFamily);
const ROUND = font("700", fredoka.style.fontFamily);
const ITALIC = font("italic 900", playfairItalic.style.fontFamily);
const MONO = font("500", plexMono.style.fontFamily);
const STICKER = font("700", corben.style.fontFamily);

const s = styles as Record<string, string>;
const cx = (...names: string[]) => names.map((n) => s[n] ?? n).join(" ");

// 文字を1字ずつ <span> に分ける（--i は時間差の順番）
const letters = (text: string, start = 0, extra = "") =>
  text.split("").map((c, i) => (
    <span key={i} className={cx("ch", extra)} style={{ "--i": i + start } as CSSProperties}>
      {c}
    </span>
  ));

// 文字のまわりに、円を描くように影を並べて「縁取り」を作る（text-shadow を重ねる）
// radius：縁取りの太さ（em）／dx・dy：全体のずらし（影に使う）
function ring(color: string, radius: number, dx = 0, dy = 0) {
  const out: string[] = [];
  for (const r of [radius, radius * 0.6]) {
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * Math.PI * 2;
      out.push(`${(dx + Math.cos(a) * r).toFixed(3)}em ${(dy + Math.sin(a) * r).toFixed(3)}em 0 ${color}`);
    }
  }
  return out.join(",");
}
// P17 ステッカー：下から「薄い影」「黒い外周」「白い縁取り」「黒い文字」の4層
// （層を分けるのは、文字どうしの間に黒い線が入らず、白がひと続きのステッカーになるようにするため。
//   影だけ別の層にしているのは、マウスを乗せたときにステッカーだけが沈み、影はその場に残るようにするため）
const STICKER_SHADOW = `0.035em 0.07em 0 #d3ccbd,${ring("#d3ccbd", 0.135, 0.035, 0.07)}`;
const STICKER_OUTER = ring("#121212", 0.135);
const STICKER_WHITE = ring("#ffffff", 0.1);

// SVG の文字の大きさを測って、表示枠をぴったりに合わせる
function fitSvg(svg: SVGSVGElement) {
  const t = svg.querySelector("text");
  if (!t) return null;
  const b = t.getBBox();
  const pad = b.height * 0.04;
  svg.setAttribute("viewBox", [b.x - pad, b.y - pad, b.width + pad * 2, b.height + pad * 2].join(" "));
  return b;
}

// 今のロゴを SVG で組み立てる（edge：文字がどちらの境界から出てくるか／perLetter：1文字ずつ動かすか）
function currentLogo(uid: string, edge: "top" | "bottom", perLetter: boolean) {
  const wmClip =
    edge === "top"
      ? <rect x="-10" y="0" width="365" height={perLetter ? 80 : 110} />
      : <rect x="-10" y="-80" width="365" height="154" />;
  const slClip = edge === "top" ? <rect x="-10" y="78" width="365" height="30" /> : <rect x="-10" y="60" width="365" height="41" />;
  const wm = perLetter
    ? LOGO_LETTERS.map((d, i) => <path key={i} className={s.ch} style={{ "--i": i } as CSSProperties} d={d} />)
    : <path className={s.ln} d={LOGO_LETTERS.join(" ")} />;
  const sub = <path className={s.ln} d={LOGO_SUB} />;
  return (
    <svg viewBox={LOGO_VIEWBOX} aria-hidden="true">
      <defs>
        <clipPath id={`wm-${uid}`}>{wmClip}</clipPath>
        <clipPath id={`sl-${uid}`}>{slClip}</clipPath>
      </defs>
      {edge === "top" && !perLetter ? (
        <g clipPath={`url(#wm-${uid})`}>
          <g className={s.wm} fill="#000">{wm}</g>
          <g className={s.sl} fill="#000">{sub}</g>
        </g>
      ) : (
        <>
          <g clipPath={`url(#wm-${uid})`}><g className={s.wm} fill="#000">{wm}</g></g>
          <g clipPath={`url(#sl-${uid})`}><g className={s.sl} fill="#000">{sub}</g></g>
        </>
      )}
    </svg>
  );
}

export const LOGO_PATTERNS: LogoPattern[] = [
  {
    id: "p01", name: "赤いN", className: cx("p01"), fonts: [SLAB],
    render: () => (
      <div className={s.word} data-fit="1">
        <span className={cx("ch", "red")} style={{ "--i": 0 } as CSSProperties}>N</span>
        {letters("owledge", 1)}
      </div>
    ),
  },
  {
    id: "p02", name: "太い斜体", className: cx("p02"), fonts: [ITALIC],
    render: () => <div className={s.word} data-fit="1">nowledge</div>,
  },
  {
    id: "p03", name: "罫線と紙", className: cx("p03"), fonts: [SLAB, MONO],
    render: ({ year, month }) => (
      <div className={s.paper}>
        <i className={s.rh} />
        <i className={s.rv} />
        <span className={s.no}>No.{month}<br />{year}</span>
        <div className={s.word} data-fit=".56">nowledge</div>
      </div>
    ),
  },
  {
    id: "p04", name: "はみ出す極太", className: cx("p04"), fonts: [BLACK],
    render: () => <div className={s.block} data-fit="1"><span className={s.word}>NOWLEDGE</span></div>,
  },
  {
    id: "p05", name: "黒いNと水色", className: cx("p05"), fonts: [BLACK],
    render: () => (
      <div className={s.word} data-fit="1">
        <span className={cx("ch", "n")} style={{ "--i": 0 } as CSSProperties}>N</span>
        {letters("owledge", 1)}
      </div>
    ),
  },
  {
    id: "p07", name: "目", className: cx("p07"),
    render: ({ uid }) => (
      <div className={s.word} data-fit="1">
        N
        <svg className={s.eye} viewBox="0 0 100 100" aria-hidden="true">
          <defs><clipPath id={`eye-${uid}`}><circle cx="50" cy="50" r="48" /></clipPath></defs>
          <circle cx="50" cy="50" r="48" fill="#111" />
          <g className={s.iris}>
            <circle cx="50" cy="50" r="27" fill="#1FA67A" />
            <circle cx="50" cy="50" r="11" fill="#111" />
            <circle cx="43" cy="42" r="4" fill="#fff" />
          </g>
          <g clipPath={`url(#eye-${uid})`}><rect className={s.lid} x="0" y="0" width="100" height="100" fill="#111" /></g>
        </svg>
        wledge
      </div>
    ),
  },
  {
    id: "p08", name: "ビー玉", className: cx("p08"), fonts: [BLACK],
    render: ({ uid }) => (
      <svg aria-hidden="true">
        <defs><clipPath id={`mb-${uid}`}><text x="0" y="0">Nowledge</text></clipPath></defs>
        <text className={s.fill} x="0" y="0">Nowledge</text>
        <g className={s.marbles} clipPath={`url(#mb-${uid})`} />
      </svg>
    ),
    // 文字の大きさに合わせて、黒い玉を敷き詰める（降ってくる時間差もここで決める）
    after: (root) => {
      const svg = root.querySelector("svg");
      const group = root.querySelector(`.${s.marbles}`);
      if (!svg || !group || svg.dataset.done) return;
      const b = fitSvg(svg);
      if (!b) return;
      const r = b.height * 0.05;
      const step = r * 2.25;
      let out = "";
      for (let y = b.y + r; y < b.y + b.height; y += step) {
        for (let x = b.x + r; x < b.x + b.width; x += step) {
          const cx = x + (Math.random() - 0.5) * r * 0.6;
          const cy = y + (Math.random() - 0.5) * r * 0.6;
          const d = (0.25 + ((cx - b.x) / b.width) * 0.45 + Math.random() * 0.3).toFixed(2);
          out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" style="--d:${d}s;--fy:${(-(b.height * 1.4)).toFixed(0)}px"/>`;
        }
      }
      group.innerHTML = out;
      svg.dataset.done = "1";
    },
  },
  {
    id: "p09", name: "版ズレ", className: cx("p09"), fonts: [BLACK],
    render: () => (
      <svg aria-hidden="true">
        <text className={s.c} x="0" y="0">Nowledge</text>
        <text className={s.m} x="0" y="0">Nowledge</text>
        <text className={s.y} x="0" y="0">Nowledge</text>
      </svg>
    ),
    after: (root) => {
      const svg = root.querySelector("svg");
      if (!svg) return;
      const b = fitSvg(svg);
      if (!b) return;
      svg.querySelectorAll("text").forEach((t) => t.setAttribute("stroke-width", (b.height * 0.028).toFixed(2)));
    },
  },
  {
    id: "p10", name: "押し出し", className: cx("p10"),
    render: () => <div className={s.word} data-fit=".96">Nowledge</div>,
  },
  {
    id: "p11", name: "棚", className: cx("p11"),
    render: () => (
      <div className={s.word} data-fit=".96">
        {letters("Nowledge")}
        <i className={s.shelf} />
        <i className={cx("bracket", "b1")} />
        <i className={cx("bracket", "b2")} />
      </div>
    ),
  },
  {
    id: "p12", name: "クローム", className: cx("p12"), is3d: "chrome",
    render: () => <div className={s.mark3d} />,
  },
  {
    id: "p13", name: "緑の風船", className: cx("p13"), is3d: "balloon", fonts: [ROUND],
    render: () => <div className={s.mark3d} />,
  },
  {
    id: "p14", name: "降りてくる", className: cx("p14", "ex"), full: true,
    render: ({ uid }) => currentLogo(uid, "top", false),
  },
  {
    id: "p15", name: "1文字ずつせり上がる", className: cx("p15", "ex"), full: true,
    render: ({ uid }) => currentLogo(uid, "bottom", true),
  },
  {
    id: "p17", name: "ステッカー", className: cx("p17"), fonts: [STICKER],
    render: () => (
      <div className={s.word} data-fit=".9">
        <span className={s.stk}>
          <span className={cx("lay", "shadow")} style={{ textShadow: STICKER_SHADOW }} aria-hidden="true">{letters("Nowledge")}</span>
          {/* マウスを乗せると、この中（ステッカー本体）だけが下に沈む */}
          <span className={s.press}>
            <span className={cx("lay", "outer")} style={{ textShadow: STICKER_OUTER }} aria-hidden="true">{letters("Nowledge")}</span>
            <span className={cx("lay", "white")} style={{ textShadow: STICKER_WHITE }} aria-hidden="true">{letters("Nowledge")}</span>
            <span className={s.fillText}>{letters("Nowledge")}</span>
          </span>
        </span>
      </div>
    ),
  },
];
