import { forwardRef } from "react";
import styles from "@/styles/components/atoms/Loader.module.css";

/**
 * ローディング表示（記事の読み込み中に一覧の下に出る）
 * デザイン：Figma「knowledge WF」Knowledge_PC_Kekka の「Please Wait...」
 *   - 文字：Helvetica 18px（スマホは 16px）
 *   - その下に ∨ が3つ。上から順に濃くなるアニメーション
 * ※この要素は「画面に入ったら次の記事を読み込む」目印も兼ねている（ref）
 */
const Loader = forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    className="py-[28px] md:py-[36px] grid place-items-center"
    role="status"
    aria-live="polite"
  >
    <div className="flex flex-col items-center">
      <p className="font-hel text-[16px] md:text-[18px] leading-[0.98] tracking-[-0.01em]">
        Please Wait...
      </p>
      {/* ∨ ×3（Figma から書き出した形） */}
      <svg
        viewBox="0 0 15 29"
        fill="none"
        className="mt-[12px] md:mt-[14px] w-[13px] md:w-[15px] h-auto"
        aria-hidden="true"
      >
        <path
          className={styles.chevron}
          d="M0.623439 0.786957L7.18139 5.97956L13.7391 0.786957"
          stroke="black"
          strokeWidth="2"
        />
        <path
          className={styles.chevron}
          d="M0.623439 11.657L7.18139 16.8496L13.7391 11.657"
          stroke="black"
          strokeWidth="2"
        />
        <path
          className={styles.chevron}
          d="M0.623439 22.527L7.18139 27.7196L13.7391 22.527"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    </div>
  </div>
));

Loader.displayName = "Loader";

export default Loader;
