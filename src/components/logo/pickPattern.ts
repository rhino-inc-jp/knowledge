/**
 * ページを開いたときに表示するロゴの案を決める
 * - URL に ?logo=p07 があれば、その案に固定（確認・レビュー用）
 * - なければランダム
 */
export function pickPatternId(
  search: string,
  ids: string[],
  random: () => number = Math.random
): string {
  const requested = new URLSearchParams(search).get("logo")?.toLowerCase();
  if (requested && ids.includes(requested)) return requested;
  return ids[Math.min(ids.length - 1, Math.floor(random() * ids.length))];
}
