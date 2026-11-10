import type { Material, Object3D, Texture } from 'three';

/** Deeply dispose geometries, materials and textures of a scene graph (GPU memory is not GC'd). */
export function disposeScene(root: Object3D) {
  root.traverse((object) => {
    const mesh = object as Object3D & { geometry?: { dispose(): void }; material?: Material | Material[] };
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    for (const material of materials) {
      for (const value of Object.values(material)) {
        if (value && typeof value === 'object' && (value as Texture).isTexture) (value as Texture).dispose();
      }
      const uniforms = (material as Material & { uniforms?: Record<string, { value: unknown }> }).uniforms;
      for (const uniform of Object.values(uniforms ?? {})) {
        const v = uniform.value as Texture | undefined;
        if (v && typeof v === 'object' && v.isTexture) v.dispose();
      }
      material.dispose();
    }
  });
}
