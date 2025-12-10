"use client";

export default function Page() {
  return (
    <button
      onClick={() => alert("テスト実装中")}
      className="border bg-blue-400 text-slate-50 p-[5px_5px]"
    >
      絶対に押すなよ？（テスト中）
    </button>
  );
}
