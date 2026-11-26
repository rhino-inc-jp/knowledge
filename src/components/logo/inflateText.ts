/**
 * 文字の形から「空気でパンパンにふくらんだ風船」の高さを計算する（P13 緑の風船）
 *
 * 1. 文字を画像として描き、文字の部分（mask=1）とそれ以外（mask=0）に分ける
 * 2. 文字の内側の各点について「縁からの距離」を求める
 * 3. 縁で0・内側ほど高くなるよう √（ルート）で盛り上げる → 断面が丸く、ふくらんだ形になる
 * 4. 文字のまわりに薄い「継ぎ目（ひだ）」を足し、縁の近くに細かいしわを付ける
 *
 * ここは Three.js を使わない計算だけ（自動テストできるように分けている）。
 */

const FAR = 1e20;

// 1次元の距離変換（Felzenszwalb & Huttenlocher の方法）。d に「一番近い 0 の点までの距離の2乗」を入れる
function edt1d(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
  let k = 0;
  v[0] = 0;
  z[0] = -Infinity;
  z[1] = Infinity;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}

/**
 * 各点から「mask が value の点」までの一番近い距離（ピクセル単位）
 * value の点そのものは 0
 */
export function distanceTo(mask: Uint8Array, w: number, h: number, value: 0 | 1): Float32Array {
  const n = Math.max(w, h);
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  const grid = new Float64Array(w * h);
  for (let i = 0; i < w * h; i++) grid[i] = mask[i] === value ? 0 : FAR;

  // 縦方向
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = grid[y * w + x];
    edt1d(f, h, d, v, z);
    for (let y = 0; y < h; y++) grid[y * w + x] = d[y];
  }
  // 横方向
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = grid[y * w + x];
    edt1d(f, w, d, v, z);
    for (let x = 0; x < w; x++) grid[y * w + x] = d[x];
  }

  const out = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = Math.sqrt(grid[i]);
  return out;
}

export type InflateField = {
  w: number;
  h: number;
  z: Float32Array; // 高さ（ふくらみの一番高いところが約1）
  include: Uint8Array; // 形に含まれる点（文字の部分＋まわりの継ぎ目）
  maxIn: number; // 文字の内側で、縁から一番遠い点までの距離（ピクセル）
};

export type InflateOptions = {
  flange?: number; // 継ぎ目（文字のまわりの薄いひだ）の幅（ピクセル）
  wrinkle?: number; // 縁のしわの強さ
  blur?: number; // なめらかにする回数（多いほど丸く柔らかい）
};

export function inflateField(mask: Uint8Array, w: number, h: number, opts: InflateOptions = {}): InflateField {
  const flange = opts.flange ?? 2.4;
  const wrinkle = opts.wrinkle ?? 0.035;
  const blurPasses = opts.blur ?? 6;

  const dIn = distanceTo(mask, w, h, 0); // 文字の内側：一番近い「文字でない点」までの距離
  const dOut = distanceTo(mask, w, h, 1); // 文字の外側：一番近い「文字の点」までの距離

  let maxIn = 1;
  for (let i = 0; i < w * h; i++) if (mask[i] && dIn[i] > maxIn) maxIn = dIn[i];

  const z = new Float32Array(w * h);
  const include = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    if (mask[i]) {
      // 縁で0、内側ほど高い。円の断面（真ん中が丸く張った、空気でパンパンの形）
      const t = Math.min(1, dIn[i] / maxIn);
      z[i] = Math.sqrt(t * (2 - t));
      include[i] = 1;
    } else if (dOut[i] <= flange) {
      include[i] = 1;
    }
  }

  // 中心の稜線（とがり）をなめらかにする
  const tmp = new Float32Array(w * h);
  for (let p = 0; p < blurPasses; p++) {
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        if (!mask[i]) { tmp[i] = z[i]; continue; }
        let sum = 0, cnt = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const j = i + dy * w + dx;
          if (mask[j]) { sum += z[j]; cnt++; }
        }
        tmp[i] = sum / cnt;
      }
    }
    z.set(tmp);
  }

  // 継ぎ目の薄い厚みと、縁の近くの細かいしわ
  for (let i = 0; i < w * h; i++) {
    if (!include[i]) continue;
    const x = i % w, y = (i / w) | 0;
    // 縁の近くだけに付ける、大きくゆるいひだ（細かすぎると、くしゃくしゃのアルミ箔に見える）
    const wr = Math.sin(x * 0.17 + y * 0.06) * Math.sin(y * 0.2 - x * 0.05);
    if (mask[i]) {
      const nearEdge = Math.exp(-dIn[i] / (maxIn * 0.14));
      z[i] = z[i] + 0.035 + wrinkle * wr * nearEdge;
    } else {
      const t = 1 - dOut[i] / flange; // 外側の縁で 0 になる（表と裏が閉じる）
      z[i] = 0.035 * t + wrinkle * 0.5 * wr * t;
    }
  }

  return { w, h, z, include, maxIn };
}
