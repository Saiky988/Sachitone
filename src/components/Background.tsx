import { ParticleField } from "./ParticleField";

/**
 * Fixed cinematic backdrop: layered dark gradients, a WebGL dust field, and
 * gradient scrims that keep text readable over whatever the layers show.
 */
export function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-fallback" />
      <div className="bg-overlay" />
      <ParticleField />
    </div>
  );
}
