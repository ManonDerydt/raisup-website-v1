// The Readiness Orb: 100 facets on a sphere; the first N light up in the band color for a score of N.
// Falls back to a static SVG dial without WebGL, on low-end devices, or when reduced motion is requested.

const FACETS = 100;

export function bandColor(score, styles = getComputedStyle(document.documentElement)) {
  const token = score >= 80 ? '--good' : score >= 50 ? '--ok' : '--bad';
  return styles.getPropertyValue(token).trim() || '#5B3DF5';
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function canUseWebGL() {
  if ((navigator.hardwareConcurrency || 8) <= 2) return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

function svgDial(container, score) {
  const r = 42;
  const c = 2 * Math.PI * r;
  container.innerHTML = `<svg viewBox="0 0 100 100" role="img" aria-label="Score ${score} out of 100">
    <circle cx="50" cy="50" r="${r}" fill="none" stroke="var(--line)" stroke-width="7"/>
    <circle class="dial-arc" cx="50" cy="50" r="${r}" fill="none" stroke="${bandColor(score)}" stroke-width="7" stroke-linecap="round"
      stroke-dasharray="${(c * score) / 100} ${c}" transform="rotate(-90 50 50)"/>
  </svg>`;
  return {
    setScore(next) {
      const arc = container.querySelector('.dial-arc');
      arc.setAttribute('stroke-dasharray', `${(c * next) / 100} ${c}`);
      arc.setAttribute('stroke', bandColor(next));
    },
    pause() {}, play() {}, dispose() { container.innerHTML = ''; },
  };
}

export async function createOrb(container, { score = 0, spin = true } = {}) {
  if (!canUseWebGL()) return svgDial(container, score);
  let THREE;
  try {
    THREE = await import('three');
  } catch {
    return svgDial(container, score);
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 7.2);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9cfe8, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff8a66, 1.2);
  rim.position.set(-4, -2, -3);
  scene.add(rim);

  const group = new THREE.Group();
  group.rotation.x = 0.35;
  scene.add(group);

  // Frosted inner core.
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(1.55, 64, 64),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.35, transmission: 0.6, thickness: 1.2, transparent: true, opacity: 0.55, clearcoat: 1 }),
  );
  group.add(core);

  // Facets on a Fibonacci sphere, ordered bottom → top so the score fills like a level.
  const facetGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 6);
  facetGeometry.rotateX(Math.PI / 2);
  const material = new THREE.MeshStandardMaterial({ roughness: 0.28, metalness: 0.15 });
  const facets = new THREE.InstancedMesh(facetGeometry, material, FACETS);
  const dummy = new THREE.Object3D();
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < FACETS; i++) {
    const y = -1 + (2 * (i + 0.5)) / FACETS;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const normal = new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
    dummy.position.copy(normal).multiplyScalar(1.8);
    dummy.lookAt(normal.clone().multiplyScalar(4));
    dummy.updateMatrix();
    facets.setMatrixAt(i, dummy.matrix);
  }
  group.add(facets);

  const unlit = new THREE.Color('#E4DDF0');
  let current = 0;
  let target = score;
  let litColor = new THREE.Color(bandColor(score));

  function paint(value) {
    const lit = Math.round(value);
    for (let i = 0; i < FACETS; i++) facets.setColorAt(i, i < lit ? litColor : unlit);
    facets.instanceColor.needsUpdate = true;
  }
  paint(0);

  function resize() {
    const { width, height } = container.getBoundingClientRect();
    const size = Math.max(1, Math.min(width, height));
    renderer.setSize(size, size, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
  }
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  let running = !prefersReducedMotion();
  let visible = true;
  let frame = 0;
  let last = performance.now();
  const reduced = prefersReducedMotion();
  if (reduced) current = target;

  function render(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (current < target) current = Math.min(target, current + dt * 70);
    else if (current > target) current = Math.max(target, current - dt * 70);
    paint(current);
    if (spin && running) group.rotation.y += dt * 0.25;
    renderer.render(scene, camera);
    if ((running || current !== target) && visible) frame = requestAnimationFrame(render);
    else frame = 0;
  }
  const kick = () => {
    if (!frame && visible) {
      last = performance.now();
      frame = requestAnimationFrame(render);
    }
  };
  kick();

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) kick();
  });
  io.observe(container);

  return {
    setScore(next) {
      target = Math.max(0, Math.min(100, next));
      litColor = new THREE.Color(bandColor(target));
      if (reduced) current = target;
      kick();
    },
    pause() { running = false; },
    play() { if (!reduced) { running = true; kick(); } },
    dispose() {
      cancelAnimationFrame(frame);
      io.disconnect();
      resizeObserver.disconnect();
      renderer.dispose();
      container.innerHTML = '';
    },
  };
}
