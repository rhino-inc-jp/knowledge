import Image from "next/image";

// お問い合わせ先（ライノ公式サイトのお問い合わせページ。新しいタブで開く）
const CONTACT_URL = "https://www.rhino-inc.jp/contact/";

type Props = {
  // マイページ（お気に入り一覧）を開く
  onOpenMypage: () => void;
};

/**
 * ✉ お問い合わせ・♡ マイページへの入口
 * 検索（ハンバーガー）ボタンの左に、いつも表示しておく（検索画面を開いている間も同じ位置）
 * - PC：アイコンの位置は、これまで検索画面の中に置いていた位置（Figma「Knowledge_PC_Search」）と同じ。
 *   検索ボタン（50px）と縦の中心をそろえ、押せる範囲は 50×50px
 * - スマホ：検索ボタン（40px）と縦の中心をそろえ、押せる範囲は 40×40px（指で押しやすいように）
 * - 重なり順は検索ボタンと同じ（z-index 500）。検索画面（200）より上に出る
 */
const QuickLinks = ({ onOpenMypage }: Props) => {
  // 1つ分の押せる範囲（アイコンは真ん中に置く）
  const item =
    "flex items-center justify-center w-[40px] h-[40px] md:w-[50px] md:h-[50px] leading-[0] transition-opacity md:hover:opacity-60";

  return (
    <div className="fixed z-[500] top-[13px] right-[57px] flex gap-[2px] md:top-[32px] md:right-[86px] md:gap-[4px]">
      <a
        href={CONTACT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={item}
        aria-label="Contact（お問い合わせ・新しいタブで開きます）"
      >
        <Image src="/icon_contact.svg" width={19} height={18} alt="" />
      </a>
      <button
        type="button"
        onClick={onOpenMypage}
        className={item}
        aria-label="My Page（お気に入り一覧）"
      >
        <Image src="/icon_heart.svg" width={20} height={16} alt="" />
      </button>
    </div>
  );
};

export default QuickLinks;
