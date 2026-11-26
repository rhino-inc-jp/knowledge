import { describe, expect, it } from "vitest";
import { openLinksInNewTab } from "./openLinksInNewTab";

describe("openLinksInNewTab（コメント内のリンクを新しいタブで開く）", () => {
  it("target のないリンクに target=\"_blank\" と rel を付ける", () => {
    expect(openLinksInNewTab('<p><a href="https://example.com/">見る</a></p>')).toBe(
      '<p><a href="https://example.com/" target="_blank" rel="noopener noreferrer">見る</a></p>'
    );
  });

  it("すでに target=\"_blank\" があるリンクは、重ねて付けない", () => {
    const out = openLinksInNewTab('<a href="https://example.com/" target="_blank" rel="noopener noreferrer">見る</a>');
    expect(out.match(/target=/g)).toHaveLength(1);
    expect(out).toContain('target="_blank" rel="noopener noreferrer"');
  });

  it("target=\"_self\" などは _blank に直す", () => {
    expect(openLinksInNewTab('<a href="/x" target="_self">x</a>')).toBe('<a href="/x" target="_blank" rel="noopener noreferrer">x</a>');
  });

  it("rel の nofollow は残す", () => {
    expect(openLinksInNewTab('<a href="https://example.com/" rel="nofollow">x</a>')).toBe(
      '<a href="https://example.com/" target="_blank" rel="nofollow noopener noreferrer">x</a>'
    );
  });

  it("複数のリンク・リンク以外のタグ・空文字も扱える", () => {
    const out = openLinksInNewTab('<p>A <a href="https://a.jp/">a</a> B <abbr>x</abbr> <a href="https://b.jp/">b</a></p>');
    expect(out.match(/target="_blank"/g)).toHaveLength(2);
    expect(out).toContain("<abbr>x</abbr>");
    expect(openLinksInNewTab("")).toBe("");
  });
});
