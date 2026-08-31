import { useEffect, useRef, useState } from "react";
import {
  BufferAttribute,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { useMusic } from "../music/MusicContext";

/**
 * True Audio-Reactive Three.js Particle Wave:
 * - Seamless 360-degree feathered boundary: Left, Right, Top, Bottom, and Depth
 *   naturally dissolve into #050505 with ZERO harsh cutoffs or clipped borders.
 * - Disabled on Mobile (screen width < 768px) for optimal lightweight performance.
 * - Steady organic wave travel with physical Bass pumping and fine Treble micro-ripples.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 768;
  });

  const { getAudioData } = useMusic();
  const getAudioDataRef = useRef(getAudioData);
  getAudioDataRef.current = getAudioData;

  // Track screen size to disable/enable on mobile/desktop
  useEffect(() => {
    const checkSize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
    };

    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(pixelRatio);

    const scene = new Scene();

    // Perspective Camera setup
    const camera = new PerspectiveCamera(65, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(0, 2.2, 11);
    scene.add(camera);

    // Ultra-wide geometry extending well past viewport edges
    const planeGeometry = new PlaneGeometry(46, 30, 180, 130);

    // Custom GLSL Wave Shader with 4-Way Smooth Edge Feathering
    const planeMaterial = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uElevation: { value: 0.32 },
        uBass: { value: 0.0 },
        uMid: { value: 0.0 },
        uTreble: { value: 0.0 },
        uPixelRatio: { value: pixelRatio },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uElevation;
        uniform float uBass;
        uniform float uMid;
        uniform float uTreble;
        uniform float uPixelRatio;

        attribute float aSize;

        varying vec3 vWorldPosition;
        varying float vPositionY;
        varying float vParticleShimmer;

        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            
            // Constant, steady traveling organic waves
            float t = uTime * 0.85;
            float wave1 = sin(modelPosition.x * 0.38 - t) * sin(modelPosition.z * 0.28 + t * 0.8) * uElevation;
            float wave2 = cos(modelPosition.x * 0.2 + modelPosition.z * 0.4 - t * 0.65) * (uElevation * 0.4);
            
            // Real Bass Pump: vertical physical heave on kicks
            float bassPump = sin(modelPosition.x * 0.32 + modelPosition.z * 0.22 - t * 1.2) * (uBass * 0.35);

            // Real Treble & High-note micro-ripples
            float trebleRipple = sin(modelPosition.x * 1.8 + modelPosition.z * 1.5 + t * 1.4) * (uTreble * 0.12);
            float trebleShimmer = cos(modelPosition.x * 2.8 - modelPosition.z * 2.2 - t * 1.8) * (uTreble * 0.07);

            float totalY = wave1 + wave2 + bassPump + trebleRipple + trebleShimmer;
            modelPosition.y += totalY;

            vec4 viewPosition = viewMatrix * modelPosition;
            gl_Position = projectionMatrix * viewPosition;

            // Delicate point sizing
            float sizeMultiplier = 13.5 + uBass * 3.5 + uTreble * 2.0;
            float pSize = (sizeMultiplier * aSize * uPixelRatio) * (1.0 / - viewPosition.z);
            gl_PointSize = clamp(pSize, 1.0, 8.0);

            vWorldPosition = modelPosition.xyz;
            vPositionY = totalY;
            vParticleShimmer = trebleShimmer;
        }
      `,
      fragmentShader: `
        uniform float uBass;
        uniform float uMid;
        uniform float uTreble;

        varying vec3 vWorldPosition;
        varying float vPositionY;
        varying float vParticleShimmer;

        void main() {
            // Soft anti-aliased circular particle
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            float circleAlpha = smoothstep(0.5, 0.08, dist);

            // 1. Smooth Left edge feathering (removes ANY harsh left cutoff)
            float fadeLeft = smoothstep(-25.0, -12.0, vWorldPosition.x);
            // 2. Smooth Right edge feathering (keeps Identity card clean)
            float fadeRight = smoothstep(2.0, -4.5, vWorldPosition.x);
            // 3. Smooth Top edge feathering (stays below buttons & subtitle)
            float fadeTop = smoothstep(-1.2, -3.2, vWorldPosition.y);
            // 4. Smooth Bottom edge feathering
            float fadeBottom = smoothstep(-6.5, -4.6, vWorldPosition.y);
            // 5. Smooth Depth distance fade
            float fadeZ = smoothstep(-16.0, -1.0, vWorldPosition.z);

            float edgeFade = fadeLeft * fadeRight * fadeTop * fadeBottom * fadeZ;

            // Wave height brightness
            float strength = clamp((vPositionY + 0.35) * 1.1 + uBass * 0.25, 0.15, 0.98);
            
            // Monochrome silver base with audio-reactive emerald green (#86efac) on crests
            float greenAmount = clamp(vPositionY * 0.9 + uBass * 0.35 + uMid * 0.3, 0.0, 0.7);
            vec3 baseColor = vec3(0.82, 0.85, 0.90);
            vec3 emeraldColor = vec3(0.52, 0.94, 0.67);
            vec3 color = mix(baseColor, emeraldColor, greenAmount);
            
            // Sparkling brightness on treble notes
            color += vec3(0.15, 0.2, 0.18) * uTreble * clamp(vParticleShimmer * 10.0, 0.0, 1.0);

            float alpha = strength * circleAlpha * edgeFade * 0.68;
            gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.85));
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    // Random size attribute
    const count = planeGeometry.attributes.position.count;
    const planeSizesArray = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      planeSizesArray[i] = 0.6 + Math.random() * 2.6;
    }
    planeGeometry.setAttribute("aSize", new BufferAttribute(planeSizesArray, 1));

    const plane = new Points(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI * 0.44;
    // Shift wide to the left and lower bottom
    plane.position.set(-6.5, -3.6, -1.0);
    scene.add(plane);

    // Resize Handler
    const onResize = () => {
      if (window.innerWidth < 768) return;
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      const newPR = Math.min(window.devicePixelRatio, 2);
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(newPR);
      planeMaterial.uniforms.uPixelRatio.value = newPR;
    };

    window.addEventListener("resize", onResize);

    // Restrained Pointer Parallax
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Smooth Audio State (Dual Attack/Decay Damping for Silky Organic Feel)
    let smoothBass = 0;
    let smoothMid = 0;
    let smoothTreble = 0;

    // Animation Loop
    let rafId = 0;
    const startTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const elapsedTime = (now - startTime) / 1000;

      // Extract real-time audio data
      const audioData = getAudioDataRef.current();
      const targetBass = audioData.isPlaying ? audioData.bass : 0;
      const targetMid = audioData.isPlaying ? audioData.mid : 0;
      const targetTreble = audioData.isPlaying ? audioData.treble : 0;

      // Dual-rate smoothing: Snappy on beats (fast attack), silky soft on decay (slow release)
      const bassSpeed = targetBass > smoothBass ? 0.28 : 0.065;
      smoothBass += (targetBass - smoothBass) * bassSpeed;

      const midSpeed = targetMid > smoothMid ? 0.22 : 0.07;
      smoothMid += (targetMid - smoothMid) * midSpeed;

      const trebleSpeed = targetTreble > smoothTreble ? 0.32 : 0.08;
      smoothTreble += (targetTreble - smoothTreble) * trebleSpeed;

      // Update shader uniforms
      planeMaterial.uniforms.uTime.value = elapsedTime;
      planeMaterial.uniforms.uElevation.value = 0.32 + smoothBass * 0.22;
      planeMaterial.uniforms.uBass.value = smoothBass;
      planeMaterial.uniforms.uMid.value = smoothMid;
      planeMaterial.uniforms.uTreble.value = smoothTreble;

      // Smooth camera tilt
      camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.035;
      camera.position.y += (2.2 + pointer.y * 0.2 - camera.position.y) * 0.035;
      camera.lookAt(-1.2, -0.6, 0);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    // Start animation loop
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);

      planeGeometry.dispose();
      planeMaterial.dispose();
      renderer.dispose();
    };
  }, [isDesktop]);

  if (!isDesktop) {
    return null;
  }

  return <canvas ref={canvasRef} className="webgl-canvas" aria-hidden="true" />;
}
