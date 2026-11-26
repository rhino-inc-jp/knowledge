/**
 * コメント（microCMS のリッチエディタの HTML）に入っているリンクを、すべて新しいタブで開くようにする
 *
 * microCMS では、リンクごとに「新しいタブで開く」を選んだかどうかで target="_blank" の有無が変わる。
 * 入力の仕方に関係なく、記事一覧から外部サイトへ移動してしまわないよう、表示するときにそろえる。
 * - target="_blank" を付ける（すでにあれば付け直す）
 * - rel に noopener noreferrer を付ける（外部サイトから元のタブを操作されないため）。nofollow などは残す
 */
export function openLinksInNewTab(html: string): string {
  return html.replace(/<a\b([^>]*)>/gi, (_tag, attrs: string) => {
    // 今の rel の値（nofollow など）を取っておく
    const relMatch = attrs.match(/\srel\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const relTokens = new Set(
      (relMatch ? relMatch[1] ?? relMatch[2] ?? relMatch[3] ?? "" : "").split(/\s+/).filter(Boolean)
    );
    relTokens.add("noopener");
    relTokens.add("noreferrer");

    // 今の target・rel を外してから付け直す
    const rest = attrs.replace(/\s(?:target|rel)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
    return `<a${rest} target="_blank" rel="${Array.from(relTokens).join(" ")}">`;
  });
}
