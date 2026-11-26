/**
 * 本物の3Dのロゴ（P12 クローム・P13 緑の風船）
 *
 * Three.js はこの案が選ばれたときだけ読み込む（import() で別ファイルに分かれる）。
 * 1回だけ動かして止める。止まった後は描き直さない（電池を使わない）。
 *
 * - P12 クローム：立体文字（TextGeometry）に金属の質感。書体データは three.js 付属の
 *   helvetiker bold から、使う7文字だけを抜き出したもの
 * - P13 緑の風船：文字の形を画像に描き、縁からの距離で盛り上げて「空気でパンパンの風船」にする
 *   （inflateText.ts）。文字が読めることより、ふくらんだ質感を優先している
 */
import { inflateField } from "./inflateText";

export type Logo3D = {
  play: () => void;
  resize: () => void;
  destroy: () => void;
};

type Three = typeof import("three");

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutElastic = (t: number) =>
  t === 0 || t === 1 ? t : Math.pow(2, -8 * t) * Math.sin(((t * 9 - 0.75) * (2 * Math.PI)) / 3) + 1;

// 文字を画像に描いて、文字の部分を 1・それ以外を 0 にする（太らせて丸く、隣の文字とつながるくらいに）
function rasterizeText(text: string, fontFamily: string, targetWidth: number) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.font = `700 100px ${fontFamily}`;
  const ratio = ctx.measureText(text).width / 100;
  const fontPx = targetWidth / (ratio + 0.5);
  const pad = Math.ceil(fontPx * 0.25);
  const w = Math.ceil(ratio * fontPx + pad * 2);
  const h = Math.ceil(fontPx * 1.2 + pad * 2);
  canvas.width = w;
  canvas.height = h;
  ctx.font = `700 ${fontPx}px ${fontFamily}`;
  ctx.lineJoin = "round";
  ctx.lineWidth = fontPx * 0.1;
  ctx.fillStyle = ctx.strokeStyle = "#000";
  const baseline = pad + fontPx * 0.92;
  ctx.strokeText(text, pad, baseline);
  ctx.fillText(text, pad, baseline);
  const data = ctx.getImageData(0, 0, w, h).data;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) mask[i] = data[i * 4 + 3] > 127 ? 1 : 0;
  return { mask, w, h };
}

// 風船の形（表と裏の2枚の面）を作る
function balloonGeometry(THREE: Three, fontFamily: string) {
  const { mask, w, h } = rasterizeText("Nowledge", fontFamily, 420);
  const field = inflateField(mask, w, h);
  const unit = 1 / 100; // 1ピクセル = 0.01
  const zScale = field.maxIn * unit * 1.05; // 断面がほぼ丸くなる厚み

  const index = new Int32Array(w * h).fill(-1);
  const pos: number[] = [];
  let n = 0;
  for (let i = 0; i < w * h; i++) {
    if (!field.include[i]) continue;
    index[i] = n++;
    pos.push(((i % w) - w / 2) * unit, -(((i / w) | 0) - h / 2) * unit, field.z[i] * zScale);
  }
  // 裏面（表を z 方向に反転）
  for (let i = 0; i < n; i++) pos.push(pos[i * 3], pos[i * 3 + 1], -pos[i * 3 + 2]);

  const tris: number[] = [];
  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const a = index[y * w + x], b = index[y * w + x + 1], c = index[(y + 1) * w + x], d = index[(y + 1) * w + x + 1];
      if (a < 0 || b < 0 || c < 0 || d < 0) continue;
      tris.push(a, b, c, b, d, c); // 表
      tris.push(a + n, c + n, b + n, b + n, c + n, d + n); // 裏
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(tris);
  geo.computeVertexNormals();
  geo.center();
  return geo;
}

// 立体文字（P12 クローム）
async function chromeGeometry(THREE: Three) {
  const { FontLoader } = await import("three/examples/jsm/loaders/FontLoader.js");
  const { TextGeometry } = await import("three/examples/jsm/geometries/TextGeometry.js");
  const fontData = (await import("./helvetikerNowledge.json")).default;
  const geo = new TextGeometry("Nowledge", {
    font: new FontLoader().parse(fontData),
    size: 1,
    height: 0.16,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.018,
    bevelSegments: 4,
  });
  geo.center();
  return geo;
}

export async function mount3D(
  host: HTMLElement,
  kind: "chrome" | "balloon",
  balloonFontFamily = "sans-serif"
): Promise<Logo3D> {
  const THREE = await import("three");
  const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
  const balloon = kind === "balloon";
  const geo = balloon ? balloonGeometry(THREE, balloonFontFamily) : await chromeGeometry(THREE);
  geo.computeBoundingBox();
  const textWidth = geo.boundingBox!.max.x - geo.boundingBox!.min.x;
  const textHeight = geo.boundingBox!.max.y - geo.boundingBox!.min.y;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.createElement("canvas");
  host.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = balloon ? 0.95 : 0.85;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  // 風船：光沢の強い緑のフィルム（金属っぽさを少し・表面にコーティング）
  const mat = balloon
    ? new THREE.MeshPhysicalMaterial({
        color: 0x0f7a47, metalness: 0.45, roughness: 0.13, clearcoat: 1, clearcoatRoughness: 0.04,
        envMapIntensity: 0.7, side: THREE.DoubleSide,
      })
    : new THREE.MeshPhysicalMaterial({ color: 0xaeb3bb, metalness: 1, roughness: 0.2 });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  const key = new THREE.DirectionalLight(0xffffff, balloon ? 2.4 : 0.6);
  key.position.set(-3, 4, 5);
  scene.add(key);
  if (balloon) {
    const rim = new THREE.DirectionalLight(0xffffff, 0.8);
    rim.position.set(4, -2, 3);
    scene.add(rim);
  }

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  type Pose = { x: number; y: number; z: number; sx: number; sz: number };
  const final: Pose = balloon ? { x: 0.12, y: 0.22, z: 0, sx: 1, sz: 1 } : { x: 0.12, y: -0.16, z: 0, sx: 1, sz: 1 };
  const pose = (p: Pose) => {
    mesh.rotation.set(p.x, p.y, p.z);
    mesh.scale.set(p.sx, p.sx, p.sz);
  };
  const render = () => renderer.render(scene, camera);
  let raf = 0;

  // 枠の大きさに合わせて、形が横幅いっぱいに入るようカメラの距離を決める
  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    camera.aspect = w / h;
    // 横幅と高さの両方が枠に収まる距離（傾けた分の余白も見込む）
    const fovV = THREE.MathUtils.degToRad(camera.fov);
    const fovH = 2 * Math.atan(Math.tan(fovV / 2) * camera.aspect);
    const margin = balloon ? 1.08 : 1.1;
    const byWidth = (textWidth * margin) / 2 / Math.tan(fovH / 2);
    const byHeight = (textHeight * margin * 1.15) / 2 / Math.tan(fovV / 2);
    camera.position.set(0, 0, Math.max(byWidth, byHeight) + 0.4);
    camera.updateProjectionMatrix();
    render();
  };

  const play = () => {
    cancelAnimationFrame(raf);
    if (reduce) {
      pose(final);
      render();
      return;
    }
    const t0 = performance.now();
    const dur = balloon ? 1700 : 1700;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      if (balloon) {
        // 平らなシートに空気が入って、パンパンにふくらむ（少し揺れて止まる）
        const e = easeOutElastic(t);
        pose({
          x: final.x, y: final.y + Math.sin(t * 9) * (1 - t) * 0.1, z: Math.sin(t * 12) * (1 - t) * 0.06,
          sx: 0.9 + 0.1 * Math.min(1, e), sz: Math.max(0.03, e),
        });
      } else {
        const e = easeOutCubic(t);
        pose({ x: 0.7 + (final.x - 0.7) * e, y: -1.5 + (final.y + 1.5) * e, z: 0, sx: 1, sz: 1 });
      }
      render();
      if (t < 1) raf = requestAnimationFrame(step);
      else {
        pose(final);
        render();
      }
    };
    raf = requestAnimationFrame(step);
  };

  const destroy = () => {
    cancelAnimationFrame(raf);
    geo.dispose();
    mat.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };

  pose(final);
  resize();
  return { play, resize, destroy };
}
