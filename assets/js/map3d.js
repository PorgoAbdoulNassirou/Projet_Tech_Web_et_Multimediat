/*
 * Vue 3D de la carte, construite avec Three.js.
 * Le pays est une plaque de latérite extrudée à partir du contour réel ;
 * chaque récit est signalé par une colonne de lumière.
 * Le module n'est chargé qu'à la première ouverture de la vue 3D.
 */
import * as THREE from '../vendor/three/three.module.min.js';
import { OrbitControls } from '../vendor/three/OrbitControls.js';
import { MAP, OUTLINE_POINTS, project } from './geo.js';

const S = 0.012; // unités de carte vers unités 3D
const DEPTH = 0.45;

const toWorld = (x, y) => new THREE.Vector3((x - MAP.width / 2) * S, 0, (y - MAP.height / 2) * S);

function landTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = Math.round(1024 * MAP.height / MAP.width);
  const g = c.getContext('2d');
  const k = c.width / MAP.width;
  const grad = g.createRadialGradient(c.width * 0.5, c.height * 0.4, 50, c.width * 0.5, c.height * 0.5, c.width * 0.7);
  grad.addColorStop(0, '#5B4566');
  grad.addColorStop(1, '#2C2340');
  g.fillStyle = grad;
  g.fillRect(0, 0, c.width, c.height);
  // grain de terre
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = `rgba(255,236,200,${Math.random() * 0.05})`;
    g.fillRect(Math.random() * c.width, Math.random() * c.height, 2, 2);
  }
  // méridiens et parallèles
  g.strokeStyle = 'rgba(247,239,224,0.08)';
  g.lineWidth = 1;
  for (let lon = -5; lon <= 2; lon++) {
    const [x] = project(lon, 12);
    g.beginPath(); g.moveTo(x * k, 0); g.lineTo(x * k, c.height); g.stroke();
  }
  for (let lat = 10; lat <= 15; lat++) {
    const [, y] = project(0, lat);
    g.beginPath(); g.moveTo(0, y * k); g.lineTo(c.width, y * k); g.stroke();
  }
  // liseré doré le long de la frontière
  g.strokeStyle = 'rgba(232,176,75,0.7)';
  g.lineWidth = 3;
  g.beginPath();
  OUTLINE_POINTS.forEach(([x, y], i) => (i ? g.lineTo(x * k, y * k) : g.moveTo(x * k, y * k)));
  g.closePath();
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function beamTexture() {
  const c = document.createElement('canvas');
  c.width = 4; c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(1, 'rgba(255,255,255,1)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 128);
  return new THREE.CanvasTexture(c);
}

export function createMap3D(container, contes, { colors, onSelect }) {
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) throw new Error('WebGL indisponible');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0d0b16, 0.045);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.set(0, 9.5, 10.5);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 4;
  controls.maxDistance = 22;
  controls.maxPolarAngle = Math.PI * 0.44;
  controls.autoRotate = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  controls.autoRotateSpeed = 0.35;
  controls.addEventListener('start', () => { controls.autoRotate = false; flight = null; });

  scene.add(new THREE.HemisphereLight(0xb9c6ff, 0x2a1810, 1.1));
  const moon = new THREE.DirectionalLight(0xfff1d6, 2.2);
  moon.position.set(-6, 10, 4);
  scene.add(moon);
  const rim = new THREE.DirectionalLight(0xd2643a, 1.2);
  rim.position.set(6, 2, -8);
  scene.add(rim);

  /* Plaque du pays */
  const shape = new THREE.Shape(OUTLINE_POINTS.map(([x, y]) => new THREE.Vector2((x - MAP.width / 2) * S, -(y - MAP.height / 2) * S)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 });
  geo.rotateX(-Math.PI / 2);
  const tex = landTexture();
  tex.repeat.set(1 / (MAP.width * S), 1 / (MAP.height * S));
  tex.offset.set(0.5, 0.5);
  const land = new THREE.Mesh(geo, [
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, metalness: 0.05 }),
    new THREE.MeshStandardMaterial({ color: 0xb4552f, roughness: 0.75 }),
  ]);
  scene.add(land);

  /* Sol et ciel étoilé */
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(40, 64),
    new THREE.MeshStandardMaterial({ color: 0x120f1d, roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  scene.add(ground);

  const starGeo = new THREE.BufferGeometry();
  const pts = [];
  for (let i = 0; i < 900; i++) {
    const r = 60 + Math.random() * 20, th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI * 0.45;
    pts.push(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th));
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, transparent: true, opacity: 0.8, fog: false })));

  /* Colonnes de lumière */
  const beamTex = beamTexture();
  const markers = [];
  const labelsLayer = document.createElement('div');
  labelsLayer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden';
  container.append(labelsLayer);

  for (const c of contes) {
    const [x, y] = project(c.lieu.lon, c.lieu.lat);
    const p = toWorld(x, y);
    p.y = DEPTH + 0.04;
    const color = new THREE.Color(colors[c.type]);
    const group = new THREE.Group();
    group.position.copy(p);

    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 1.6, 12, 1, true),
      new THREE.MeshBasicMaterial({ color, map: beamTex, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    );
    beam.position.y = 0.8;
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), new THREE.MeshBasicMaterial({ color }));
    orb.position.y = 0.12;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.16, 0.22, 40),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    group.add(beam, orb, ring);
    orb.userData.id = c.id;
    scene.add(group);

    const label = document.createElement('button');
    label.type = 'button';
    label.className = 'label3d';
    label.textContent = c.lieu.nom.split(',')[0];
    label.style.pointerEvents = 'auto';
    label.setAttribute('aria-label', `${c.titre}, ${c.lieu.nom}`);
    label.addEventListener('click', () => onSelect(c.id));
    labelsLayer.append(label);

    markers.push({ id: c.id, group, beam, orb, ring, label, phase: Math.random() * Math.PI * 2, visible: true });
  }

  /* Clic sur une colonne */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let down = null;
  renderer.domElement.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(markers.filter((m) => m.visible).map((m) => m.orb))[0];
    if (hit) onSelect(hit.object.userData.id);
  });

  /* Vol de caméra vers un récit */
  let flight = null;
  let active = null;
  function select(id) {
    active = id;
    markers.forEach((m) => m.label.classList.toggle('is-active', m.id === id));
    const m = markers.find((x) => x.id === id);
    if (!m) return;
    controls.autoRotate = false;
    const target = m.group.position.clone();
    const offset = camera.position.clone().sub(controls.target).normalize().multiplyScalar(7.5);
    offset.y = Math.max(offset.y, 4.5);
    flight = { t: 0, fromT: controls.target.clone(), toT: target, fromC: camera.position.clone(), toC: target.clone().add(offset) };
  }

  function setFilter(fn) {
    markers.forEach((m) => {
      m.visible = fn(contes.find((c) => c.id === m.id));
      m.group.visible = m.visible;
      m.label.classList.toggle('is-dim', !m.visible);
      m.label.tabIndex = m.visible ? 0 : -1;
    });
  }

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  const v = new THREE.Vector3();
  const clock = new THREE.Clock();
  let raf = 0;
  function tick() {
    raf = requestAnimationFrame(tick);
    const dt = clock.getDelta();
    const time = clock.elapsedTime;
    if (flight) {
      flight.t = Math.min(flight.t + dt / 1.3, 1);
      const e = 1 - Math.pow(1 - flight.t, 3);
      controls.target.lerpVectors(flight.fromT, flight.toT, e);
      camera.position.lerpVectors(flight.fromC, flight.toC, e);
      if (flight.t === 1) flight = null;
    }
    controls.update();
    const w = container.clientWidth, h = container.clientHeight;
    for (const m of markers) {
      const on = m.id === active;
      const pulse = (Math.sin(time * 2 + m.phase) + 1) / 2;
      m.ring.scale.setScalar(1 + pulse * (on ? 1.6 : 0.6));
      m.ring.material.opacity = 0.7 - pulse * 0.5;
      m.beam.scale.y = on ? 1.7 : 1;
      m.beam.position.y = on ? 1.36 : 0.8;
      m.orb.scale.setScalar(on ? 1.5 : 1);
      v.copy(m.group.position);
      v.y += on ? 0.5 : 0.35;
      v.project(camera);
      const hidden = v.z > 1 || !m.visible;
      m.label.style.display = hidden ? 'none' : '';
      m.label.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px) translate(-50%, -130%)`;
    }
    renderer.render(scene, camera);
  }

  return {
    select,
    setFilter,
    start() { resize(); if (!raf) { clock.getDelta(); tick(); } },
    stop() { cancelAnimationFrame(raf); raf = 0; },
    dispose() { this.stop(); ro.disconnect(); renderer.dispose(); container.innerHTML = ''; },
  };
}
