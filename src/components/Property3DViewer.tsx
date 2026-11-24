import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Eye, EyeOff, Moon, RotateCcw, Sun, ZoomIn, ZoomOut } from 'lucide-react';
import { Language, PropertyListing } from '../types/estate';
import { TranslationBundle } from '../i18n/translations';

interface Property3DViewerProps {
  property: PropertyListing;
  language: Language;
  t: TranslationBundle;
}

const _vecTarget = new THREE.Vector3();

function buildArchitecturalModel(property: PropertyListing): {
  root: THREE.Group;
  roofGroup: THREE.Group;
  interiorLights: THREE.PointLight[];
  disposables: { geometries: THREE.BufferGeometry[]; materials: THREE.Material[] };
} {
  const root = new THREE.Group();
  const roofGroup = new THREE.Group();
  const interiorLights: THREE.PointLight[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  const { threeD } = property;
  const [sx, sz] = threeD.footprintScale;
  const width = 8.4 * sx;
  const depth = 6.2 * sz;

  const stoneMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(threeD.primaryColor),
      roughness: 0.72,
      metalness: 0.08,
    })
  );

  const darkTrimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x161922,
      roughness: 0.42,
      metalness: 0.55,
    })
  );

  const goldAccentMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(threeD.accentColor),
      roughness: 0.22,
      metalness: 0.9,
    })
  );

  const glassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x8db8cf,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.36,
      clearcoat: 1.0,
    })
  );

  const woodFloorMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x5c432d,
      roughness: 0.55,
      metalness: 0.05,
    })
  );

  const marbleFloorMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x262930,
      roughness: 0.25,
      metalness: 0.15,
    })
  );

  const sofaMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe6dfd3,
      roughness: 0.85,
      metalness: 0.02,
    })
  );

  const bedMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd5cec2,
      roughness: 0.8,
      metalness: 0.02,
    })
  );

  const waterMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x1aa7b8,
      roughness: 0.08,
      metalness: 0.12,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.88,
    })
  );

  const greeneryMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x3b5c3e,
      roughness: 0.85,
      metalness: 0.02,
    })
  );

  // Site Plinth Base (grounded at y = 0)
  const siteW = width + 4.4;
  const siteD = depth + 4.4;
  const plinth = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(siteW, 0.36, siteD)), darkTrimMat);
  plinth.position.y = 0.18;
  plinth.receiveShadow = true;
  root.add(plinth);

  // Subtle Gold Perimeter Trim around Plinth
  const plinthTrim = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(siteW + 0.08, 0.05, siteD + 0.08)),
    goldAccentMat
  );
  plinthTrim.position.y = 0.36;
  root.add(plinthTrim);

  // Ground Slab
  const groundSlab = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(width, 0.16, depth)),
    marbleFloorMat
  );
  groundSlab.position.y = 0.44;
  groundSlab.receiveShadow = true;
  root.add(groundSlab);

  // Interior Furniture & Partitions (Level 1 — visible on Roof Cutaway)
  const floor1Y = 0.52;

  // Living Room Area
  const rug = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.8, 0.03, 2.2)), darkTrimMat);
  rug.position.set(-width * 0.22, floor1Y + 0.02, 0.2);
  root.add(rug);

  const sofaBase = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.1, 0.42, 0.85)), sofaMat);
  sofaBase.position.set(-width * 0.22, floor1Y + 0.23, -0.45);
  sofaBase.castShadow = true;
  root.add(sofaBase);

  const sofaSide = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.85, 0.42, 1.4)), sofaMat);
  sofaSide.position.set(-width * 0.22 - 0.62, floor1Y + 0.23, 0.2);
  sofaSide.castShadow = true;
  root.add(sofaSide);

  const coffeeTable = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.1, 0.28, 0.65)), goldAccentMat);
  coffeeTable.position.set(-width * 0.22 + 0.15, floor1Y + 0.16, 0.35);
  root.add(coffeeTable);

  // Kitchen Island
  const island = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.1, 0.72, 0.9)), marbleFloorMat);
  island.position.set(width * 0.18, floor1Y + 0.38, -0.6);
  island.castShadow = true;
  root.add(island);

  const islandTop = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.18, 0.06, 0.98)), goldAccentMat);
  islandTop.position.set(width * 0.18, floor1Y + 0.76, -0.6);
  root.add(islandTop);

  // Master Bed (either ground wing or upper floor)
  const hasSecondFloor = threeD.floors >= 2;
  const bedY = hasSecondFloor ? floor1Y + 2.45 : floor1Y;
  const bedFrame = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.9, 0.38, 2.1)), woodFloorMat);
  bedFrame.position.set(width * 0.24, bedY + 0.21, 1.15);
  bedFrame.castShadow = true;
  root.add(bedFrame);

  const mattress = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.75, 0.2, 1.9)), bedMat);
  mattress.position.set(width * 0.24, bedY + 0.44, 1.2);
  root.add(mattress);

  // Interior Partition Walls (Level 1)
  const wallH = 2.25;
  const centerWall = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.14, wallH, depth * 0.65)),
    stoneMat
  );
  centerWall.position.set(0.05, floor1Y + wallH / 2, -0.35);
  centerWall.castShadow = true;
  centerWall.receiveShadow = true;
  root.add(centerWall);

  // Outer Structural Columns & Glazing (Level 1)
  const cornerPositions: [number, number][] = [
    [-width / 2 + 0.16, -depth / 2 + 0.16],
    [width / 2 - 0.16, -depth / 2 + 0.16],
    [-width / 2 + 0.16, depth / 2 - 0.16],
    [width / 2 - 0.16, depth / 2 - 0.16],
  ];

  const totalWallH = hasSecondFloor ? wallH * 2 + 0.22 : wallH + 0.35;

  cornerPositions.forEach(([cx, cz]) => {
    const col = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.32, totalWallH, 0.32)),
      stoneMat
    );
    col.position.set(cx, floor1Y + totalWallH / 2, cz);
    col.castShadow = true;
    root.add(col);
  });

  // Back Solid Architectural Feature Wall
  const backWall = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(width - 0.32, wallH, 0.24)),
    stoneMat
  );
  backWall.position.set(0, floor1Y + wallH / 2, -depth / 2 + 0.14);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  root.add(backWall);

  // Front & Side Floor-to-Ceiling Curtain Glazing (Level 1)
  const frontGlass = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(width - 0.64, wallH - 0.1, 0.06)),
    glassMat
  );
  frontGlass.position.set(0, floor1Y + wallH / 2, depth / 2 - 0.15);
  root.add(frontGlass);

  const leftGlass = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.06, wallH - 0.1, depth - 0.64)),
    glassMat
  );
  leftGlass.position.set(-width / 2 + 0.15, floor1Y + wallH / 2, 0);
  root.add(leftGlass);

  const rightGlass = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.06, wallH - 0.1, depth - 0.64)),
    glassMat
  );
  rightGlass.position.set(width / 2 - 0.15, floor1Y + wallH / 2, 0);
  root.add(rightGlass);

  // Gold Mullions
  for (let i = -1; i <= 1; i++) {
    const mullion = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.06, totalWallH, 0.09)),
      goldAccentMat
    );
    mullion.position.set(i * (width * 0.28), floor1Y + totalWallH / 2, depth / 2 - 0.14);
    root.add(mullion);
  }

  // Second / Upper Level Massing
  if (hasSecondFloor) {
    const slab2 = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(width + 0.45, 0.22, depth + 0.3)),
      stoneMat
    );
    slab2.position.set(-0.15, floor1Y + wallH + 0.11, 0.1);
    slab2.castShadow = true;
    slab2.receiveShadow = true;
    root.add(slab2);

    const upperWallH = 2.15;
    const upperBack = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(width * 0.72, upperWallH, 0.22)),
      stoneMat
    );
    upperBack.position.set(width * 0.12, floor1Y + wallH + 0.22 + upperWallH / 2, -depth / 2 + 0.25);
    upperBack.castShadow = true;
    root.add(upperBack);

    const upperGlass = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(width * 0.72, upperWallH - 0.1, 0.06)),
      glassMat
    );
    upperGlass.position.set(width * 0.12, floor1Y + wallH + 0.22 + upperWallH / 2, depth / 2 - 0.22);
    root.add(upperGlass);

    // Balcony Glass Balustrade
    const balustrade = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(width * 0.28, 0.72, 0.05)),
      glassMat
    );
    balustrade.position.set(-width * 0.34, floor1Y + wallH + 0.58, depth / 2 + 0.18);
    root.add(balustrade);
  }

  // Penthouse Sky Deck / Tower Crown Variant
  if (threeD.archetype === 'penthouse' || threeD.archetype === 'apartment') {
    const terraceDeck = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(width + 1.4, 0.14, 1.8)),
      woodFloorMat
    );
    terraceDeck.position.set(0, 0.44, depth / 2 + 0.9);
    terraceDeck.receiveShadow = true;
    root.add(terraceDeck);

    const terraceRail = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(width + 1.4, 0.65, 0.05)),
      glassMat
    );
    terraceRail.position.set(0, 0.82, depth / 2 + 1.78);
    root.add(terraceRail);
  }

  // Swimming Pool / Waterfront Lagoon
  if (threeD.hasPool) {
    const poolW = width * 0.62;
    const poolD = 2.15;
    const poolBasin = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(poolW + 0.2, 0.16, poolD + 0.2)),
      darkTrimMat
    );
    poolBasin.position.set(-width * 0.15, 0.38, depth / 2 + 1.25);
    root.add(poolBasin);

    const poolWater = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(poolW, 0.08, poolD)),
      waterMat
    );
    poolWater.position.set(-width * 0.15, 0.44, depth / 2 + 1.25);
    root.add(poolWater);
  }

  if (threeD.hasLagoon) {
    const lagoon = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(siteW + 3.2, 0.08, 3.6)),
      waterMat
    );
    lagoon.position.set(0, 0.14, depth / 2 + 2.8);
    root.add(lagoon);

    const pier = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.4, 0.12, 2.4)),
      woodFloorMat
    );
    pier.position.set(width * 0.3, 0.32, depth / 2 + 2.4);
    root.add(pier);
  }

  // Courtyard Olive / Architectural Trees
  if (threeD.hasCourtyard || threeD.hasPool) {
    const treePositions: [number, number][] = [
      [width / 2 + 1.1, depth / 2 + 0.8],
      [-width / 2 - 1.1, -depth / 2 + 1.2],
      [width / 2 + 1.1, -depth / 2 + 0.9],
    ];
    treePositions.forEach(([tx, tz]) => {
      const trunk = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.09, 0.13, 1.05, 8)),
        woodFloorMat
      );
      trunk.position.set(tx, 0.88, tz);
      trunk.castShadow = true;
      root.add(trunk);

      const canopy = new THREE.Mesh(
        trackGeo(new THREE.DodecahedronGeometry(0.68, 1)),
        greeneryMat
      );
      canopy.position.set(tx, 1.72, tz);
      canopy.castShadow = true;
      root.add(canopy);
    });
  }

  // Removable Roof Group (for Cutaway / Interior View)
  const roofY = hasSecondFloor ? floor1Y + wallH + 0.22 + 2.15 + 0.14 : floor1Y + wallH + 0.16;
  const roofSlab = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(width + 0.9, 0.26, depth + 0.9)),
    stoneMat
  );
  roofSlab.position.set(0, roofY, 0);
  roofSlab.castShadow = true;
  roofSlab.receiveShadow = true;
  roofGroup.add(roofSlab);

  const roofGoldEdge = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(width + 0.96, 0.06, depth + 0.96)),
    goldAccentMat
  );
  roofGoldEdge.position.set(0, roofY + 0.14, 0);
  roofGroup.add(roofGoldEdge);

  const skylightFrame = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(width * 0.36, 0.14, depth * 0.34)),
    darkTrimMat
  );
  skylightFrame.position.set(-width * 0.12, roofY + 0.19, -0.2);
  roofGroup.add(skylightFrame);

  const skylightGlass = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(width * 0.32, 0.04, depth * 0.3)),
    glassMat
  );
  skylightGlass.position.set(-width * 0.12, roofY + 0.25, -0.2);
  roofGroup.add(skylightGlass);

  root.add(roofGroup);

  // Warm Interior Architectural Point Lights
  const l1 = new THREE.PointLight(0xffcf87, 3.2, 12, 1.5);
  l1.position.set(-width * 0.18, floor1Y + 1.85, 0.2);
  root.add(l1);
  interiorLights.push(l1);

  const l2 = new THREE.PointLight(0xffcf87, 2.8, 12, 1.5);
  l2.position.set(width * 0.22, bedY + 1.75, 0.8);
  root.add(l2);
  interiorLights.push(l2);

  return { root, roofGroup, interiorLights, disposables: { geometries, materials } };
}

export const Property3DViewer: React.FC<Property3DViewerProps> = ({ property, t }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [cutaway, setCutaway] = useState(false);
  const [twilight, setTwilight] = useState(true);
  const [contextLost, setContextLost] = useState(false);

  const stateRef = useRef({ cutaway: false, twilight: true });
  stateRef.current.cutaway = cutaway;
  stateRef.current.twilight = twilight;

  const actionsRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
    resetCam: () => void;
    triggerTransition: () => void;
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 460;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setContextLost(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.innerHTML = '';
    container.appendChild(canvas);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    const twilightColor = new THREE.Color(0x0b0e16);
    const dayColor = new THREE.Color(0x1f2837);
    scene.background = twilightColor.clone();
    scene.fog = new THREE.FogExp2(0x0b0e16, 0.022);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(envScene, 0.04);
    scene.environment = envRT.texture;
    envScene.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
    const defaultCamPos = new THREE.Vector3(11.5, 8.2, 12.2);
    camera.position.copy(defaultCamPos);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 2 - 0.06;
    controls.minDistance = 6.5;
    controls.maxDistance = 26;
    controls.target.set(0, 1.6, 0);
    controls.update();

    // Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x9fb8db, 0x2a241d, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffe1b0, 1.9);
    keyLight.position.set(12, 16, 10);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 45;
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x6d93c9, 0.65);
    rimLight.position.set(-10, 8, -10);
    scene.add(rimLight);

    // Subtle Ground Grid Plane
    const groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: 0x0d1017, roughness: 0.92, metalness: 0.05 })
    );
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = 0;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    const model = buildArchitecturalModel(property);
    scene.add(model.root);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let roofOffset = 0;
    let lightMix = stateRef.current.twilight ? 1 : 0;
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let disposed = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      try {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (!gl || typeof gl.fenceSync !== 'function') {
          frameId = window.setTimeout(cb, 80);
          return;
        }
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } catch {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.08);
        lastTime = now;

        const targetRoof = stateRef.current.cutaway ? 4.4 : 0;
        const targetTwilight = stateRef.current.twilight ? 1 : 0;

        roofOffset = THREE.MathUtils.damp(roofOffset, targetRoof, 7, dt);
        lightMix = THREE.MathUtils.damp(lightMix, targetTwilight, 6, dt);

        model.roofGroup.position.y = roofOffset;
        model.roofGroup.visible = roofOffset < 4.25;

        const bg = dayColor.clone().lerp(twilightColor, lightMix);
        scene.background = bg;
        if (scene.fog instanceof THREE.FogExp2) {
          scene.fog.color.copy(bg);
        }

        keyLight.intensity = THREE.MathUtils.lerp(2.6, 1.35, lightMix);
        hemiLight.intensity = THREE.MathUtils.lerp(1.25, 0.72, lightMix);
        model.interiorLights.forEach((pt) => {
          pt.intensity = THREE.MathUtils.lerp(1.4, 4.2, lightMix);
        });

        controls.update();
        renderer.render(scene, camera);

        const stillSettling =
          Math.abs(roofOffset - targetRoof) > 0.02 ||
          Math.abs(lightMix - targetTwilight) > 0.01;

        const done = () => {
          renderBusy = false;
          if (renderDirty || stillSettling) {
            requestRender();
          }
        };

        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    actionsRef.current = {
      zoomIn: () => {
        _vecTarget.copy(camera.position).sub(controls.target).multiplyScalar(0.82);
        if (_vecTarget.length() >= controls.minDistance) {
          camera.position.copy(controls.target).add(_vecTarget);
          controls.update();
          requestRender();
        }
      },
      zoomOut: () => {
        _vecTarget.copy(camera.position).sub(controls.target).multiplyScalar(1.22);
        if (_vecTarget.length() <= controls.maxDistance) {
          camera.position.copy(controls.target).add(_vecTarget);
          controls.update();
          requestRender();
        }
      },
      resetCam: () => {
        camera.position.copy(defaultCamPos);
        controls.target.set(0, 1.6, 0);
        controls.update();
        requestRender();
      },
      triggerTransition: () => {
        lastTime = performance.now();
        requestRender();
      },
    };

    controls.addEventListener('change', requestRender);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
          requestRender();
        }
      }
    });
    resizeObserver.observe(container);

    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('change', requestRender);
      controls.dispose();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);

      groundMesh.geometry.dispose();
      (groundMesh.material as THREE.Material).dispose();
      model.disposables.geometries.forEach((g) => g.dispose());
      model.disposables.materials.forEach((m) => m.dispose());
      envRT.dispose();
      renderer.dispose();
    };
  }, [property]);

  useEffect(() => {
    actionsRef.current?.triggerTransition();
  }, [cutaway, twilight]);

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] rounded-2xl overflow-hidden border border-[#E5C97B]/25 bg-[#0B0D11]">
      {/* Isolated WebGL Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {contextLost && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0D11]/95 p-6 text-center">
          <img
            src={property.gallery[0].url}
            alt={property.title.en}
            referrerPolicy="no-referrer"
            className="w-64 h-40 object-cover rounded-xl border border-[#E5C97B]/20 mb-4 opacity-85"
          />
          <p className="text-sm text-[#F5F3EE] font-medium">{t.modal.model3d.fallbackNote}</p>
        </div>
      )}

      {/* Minimal Top Hint */}
      <div className="pointer-events-none absolute top-4 start-4 z-10 rounded-lg bg-[#0B0D11]/90 border border-[#E5C97B]/20 px-3.5 py-2 text-xs text-[#E5C97B]">
        {t.modal.model3d.dragHint}
      </div>

      {/* Unified Collapsible-Style Bottom Control Dock (Zero backdrop-filter over WebGL) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 max-w-[94%] bg-[#0B0D11]/95 border border-[#E5C97B]/25 rounded-xl px-3 py-2 flex flex-wrap items-center justify-center gap-2 shadow-2xl">
        <button
          type="button"
          onClick={() => setCutaway((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            cutaway
              ? 'bg-[#D4AF37] text-[#0B0D11]'
              : 'bg-[#14171F] text-[#F5F3EE] hover:border-[#D4AF37]/50 border border-white/10'
          }`}
        >
          {cutaway ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{cutaway ? t.modal.model3d.cutawayOn : t.modal.model3d.cutawayOff}</span>
        </button>

        <button
          type="button"
          onClick={() => setTwilight((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#14171F] text-[#F5F3EE] border border-white/10 hover:border-[#D4AF37]/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {twilight ? (
            <>
              <Sun className="w-3.5 h-3.5 text-[#E5C97B]" />
              <span>{t.modal.model3d.dayMode}</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-[#E5C97B]" />
              <span>{t.modal.model3d.twilightMode}</span>
            </>
          )}
        </button>

        <div className="h-5 w-px bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => actionsRef.current?.zoomIn()}
            title={t.modal.model3d.zoomIn}
            aria-label={t.modal.model3d.zoomIn}
            className="p-1.5 rounded-lg bg-[#14171F] text-[#F5F3EE] border border-white/10 hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => actionsRef.current?.zoomOut()}
            title={t.modal.model3d.zoomOut}
            aria-label={t.modal.model3d.zoomOut}
            className="p-1.5 rounded-lg bg-[#14171F] text-[#F5F3EE] border border-white/10 hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => actionsRef.current?.resetCam()}
            title={t.modal.model3d.resetCam}
            aria-label={t.modal.model3d.resetCam}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#14171F] text-xs text-[#B8B3A8] hover:text-[#F5F3EE] border border-white/10 hover:border-[#D4AF37]/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.modal.model3d.resetCam}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
