/**
 * ページを開いたときに表示するロゴの案を決める
 * - URL に ?logo=p07 があれば、その案に固定（確認・レビュー用。下の「山札」は進めない）
 * - なければ「山札」方式：全案をシャッフルした順に1つずつ出し、出し切ったらシャッフルし直す
 *   （毎回ただのランダムだと、数十回程度では「なかなか出ない案」「何度も続く案」ができてしまうため。
 *    この方式なら、案の数（16回）開けば全案が1回ずつ出る。出る順番は毎回ランダム）
 * - 山札はブラウザ（localStorage）に保存する。保存できない環境では、毎回ただのランダムにする
 */

// 保存の名前（中身の形を変えたら v2 にする）
export const LOGO_DECK_KEY = "nowledge:logo-deck:v1";

// 読み書きだけできればよい（テストでは Map で代用する）
export type DeckStorage = Pick<Storage, "getItem" | "setItem">;

export function pickPatternId(
  search: string,
  ids: string[],
  random: () => number = Math.random,
  storage: DeckStorage | null = null
): string {
  const requested = new URLSearchParams(search).get("logo")?.toLowerCase();
  if (requested && ids.includes(requested)) return requested;

  if (!storage) return ids[randomIndex(ids.length, random)];

  try {
    const saved = JSON.parse(storage.getItem(LOGO_DECK_KEY) ?? "null");
    // 保存されている残りの山札（案が削除された場合などに備えて、今ある案だけ・重複なしにする）
    let deck: string[] = Array.isArray(saved?.deck)
      ? [...new Set<string>(saved.deck)].filter((id) => ids.includes(id))
      : [];
    const last: unknown = saved?.last;

    if (deck.length === 0) {
      deck = shuffle(ids, random);
      // 作り直した直後に、前回と同じ案が2回続かないようにする
      if (deck.length > 1 && deck[0] === last) [deck[0], deck[1]] = [deck[1], deck[0]];
    }

    const [next, ...rest] = deck;
    storage.setItem(LOGO_DECK_KEY, JSON.stringify({ deck: rest, last: next }));
    return next;
  } catch {
    // 保存が壊れている・書き込めない場合は、ただのランダム
    return ids[randomIndex(ids.length, random)];
  }
}

// 0〜length-1 のどれか（random() が 1 に近い値でもはみ出さない）
function randomIndex(length: number, random: () => number): number {
  return Math.min(length - 1, Math.floor(random() * length));
}

// 並びをシャッフルした新しい配列を返す（フィッシャー–イェーツ法：どの並びも同じ確率になる）
function shuffle(ids: string[], random: () => number): string[] {
  const out = [...ids];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1, random);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
