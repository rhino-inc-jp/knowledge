"use client";

/**
 * 左上のロゴ：ページを開くたびに16案からランダムに1つ表示し、1〜2秒動いて止まる
 *
 * - ブラウザだけで動かす（NowledgeLogoLoader から ssr: false で読み込む）。
 *   サーバーで描くと、ランダムの結果がサーバーとブラウザで食い違うため
 * - URL に ?logo=p07 を付けると、その案に固定できる（確認・レビュー用）
 * - 書体を読み込んで大きさを合わせ終わるまでは見せない（崩れた形が一瞬見えないように）
 * - 本物の3D の案が使えない環境（WebGL なし等）では、今のロゴを表示する
 */
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import styles from "./logo.module.css";
import { logoFontVariables } from "./fonts";
import { LOGO_PATTERNS, MONTH_COLORS } from "./patterns";
import { pickPatternId } from "./pickPattern";
import type { Logo3D } from "./Logo3D";

export default function NowledgeLogo() {
  // どの案を出すか（ページを開いたときに1回だけ決める）
  const [pattern] = useState(() => {
    const id = pickPatternId(window.location.search, LOGO_PATTERNS.map((p) => p.id));
    return LOGO_PATTERNS.find((p) => p.id === id) ?? LOGO_PATTERNS[0];
  });
  const [now] = useState(() => new Date());
  const [failed3d, setFailed3d] = useState(false);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rootRef = useRef<HTMLDivElement>(null);

  const month = now.getMonth() + 1;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let cancelled = false;
    let three: Logo3D | null = null;

    // ロゴの横幅に合わせて、文字の大きさなどを決める
    const layout = () => {
      const W = root.clientWidth;
      root.style.setProperty("--W", `${W}px`);
      root.querySelectorAll<HTMLElement>("[data-fit]").forEach((el) => {
        el.style.fontSize = "100px";
        const w = el.offsetWidth;
        if (w) el.style.fontSize = `${((100 * W * parseFloat(el.dataset.fit ?? "1")) / w).toFixed(2)}px`;
      });
      pattern.after?.(root);
      three?.resize();
    };

    // 動きを最初から再生する
    const play = () => {
      root.classList.remove(styles.play);
      void root.offsetWidth;
      root.classList.add(styles.play);
      three?.play();
    };

    (async () => {
      // 使う書体を読み込んでから大きさを合わせる（先に測ると幅がずれる）
      await Promise.all((pattern.fonts ?? []).map((f) => document.fonts.load(f).catch(() => undefined)));
      if (cancelled) return;
      layout();

      if (pattern.is3d) {
        const host = root.querySelector<HTMLElement>(`.${styles.mark3d}`);
        try {
          const { mount3D } = await import("./Logo3D");
          if (cancelled || !host) return;
          three = await mount3D(host, pattern.is3d);
          if (cancelled) {
            three.destroy();
            return;
          }
        } catch {
          if (!cancelled) setFailed3d(true);
          return;
        }
      }

      root.classList.add(styles.ready);
      requestAnimationFrame(play);
    })();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      three?.destroy();
    };
  }, [pattern]);

  // 3D が使えなかったときは、今のロゴをそのまま出す
  if (failed3d) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/logo_Nowledge.svg" alt="" aria-hidden="true" className="block w-full h-auto" />;
  }

  return (
    <div
      ref={rootRef}
      className={`${styles.logo} ${pattern.className} ${logoFontVariables}`}
      style={{ "--mc": MONTH_COLORS[month] } as CSSProperties}
      aria-hidden="true"
      data-logo={pattern.id}
    >
      <div className={styles.mark}>{pattern.render({ uid, year: now.getFullYear(), month, monthColor: MONTH_COLORS[month] })}</div>
      {!pattern.full && <p className={styles.sub}>Case Study Sharing by Rhino inc.</p>}
    </div>
  );
}
