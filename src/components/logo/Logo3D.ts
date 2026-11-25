/**
 * 本物の3Dのロゴ（P12 クローム・P13 緑の風船）
 *
 * Three.js はこの案が選ばれたときだけ読み込む（import() で別ファイルに分かれる）。
 * 立体の「Nowledge」を作り、1回だけ動かして止める。止まった後は描き直さない（電池を使わない）。
 * 3D 用の書体データは three.js 付属の helvetiker bold から、使う7文字だけを抜き出したもの。
 */

export type Logo3D = {
  play: () => void;
  resize: () => void;
  destroy: () => void;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutElastic = (t: number) =>
  t === 0 || t === 1 ? t : Math.pow(2, -9 * t) * Math.sin(((t * 10 - 0.75) * (2 * Math.PI)) / 3) + 1;

export async function mount3D(host: HTMLElement, kind: "chrome" | "balloon"): Promise<Logo3D> {
  const THREE = await import("three");
  const { FontLoader } = await import("three/examples/jsm/loaders/FontLoader.js");
  const { TextGeometry } = await import("three/examples/jsm/geometries/TextGeometry.js");
  const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
  const fontData = (await import("./helvetikerNowledge.json")).default;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.createElement("canvas");
  host.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const balloon = kind === "balloon";
  const geo = new TextGeometry("Nowledge", {
    font: new FontLoader().parse(fontData),
    size: 1,
    height: balloon ? 0.3 : 0.16,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: balloon ? 0.11 : 0.035,
    bevelSize: balloon ? 0.05 : 0.018,
    bevelSegments: balloon ? 10 : 4,
  });
  geo.center();
  geo.computeBoundingBox();
  const box = geo.boundingBox!;
  const textWidth = box.max.x - box.min.x;

  const mat = balloon
    ? new THREE.MeshPhysicalMaterial({ color: 0x0f8a62, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.05 })
    : new THREE.MeshPhysicalMaterial({ color: 0xaeb3bb, metalness: 1, roughness: 0.2 });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  const light = new THREE.DirectionalLight(0xffffff, balloon ? 1.4 : 0.6);
  light.position.set(-3, 4, 5);
  scene.add(light);

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  const final = balloon ? { x: 0.1, y: 0.12, z: 0, s: 1 } : { x: 0.12, y: -0.16, z: 0, s: 1 };
  const pose = (p: { x: number; y: number; z: number; s: number }) => {
    mesh.rotation.set(p.x, p.y, p.z);
    mesh.scale.setScalar(p.s);
  };
  const render = () => renderer.render(scene, camera);
  let raf = 0;

  // 枠の大きさに合わせて、文字が横幅いっぱいに入るようカメラの距離を決める
  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    camera.aspect = w / h;
    const fovH = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
    camera.position.set(0, 0, (textWidth * 1.1) / 2 / Math.tan(fovH / 2) + 0.4);
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
    const dur = balloon ? 1500 : 1700;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      if (balloon) {
        pose({ x: final.x, y: final.y, z: Math.sin(t * 14) * (1 - t) * 0.12, s: Math.max(0.05, easeOutElastic(t)) });
      } else {
        const e = easeOutCubic(t);
        pose({ x: 0.7 + (final.x - 0.7) * e, y: -1.5 + (final.y + 1.5) * e, z: 0, s: 1 });
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
