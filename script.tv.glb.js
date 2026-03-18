// Using Three.js, load a model of a TV and display it in the browser.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

document.body.style.margin = 0;
document.body.style.overflow = 'hidden';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement); // Add the renderer to the body of the HTML document
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 15;

// Load the model
const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

// Resolve the model path relative to this module file.
const tv_group = new THREE.Group();
scene.add(tv_group);

const modelUrl = new URL('./source/TV/TV.glb', import.meta.url).href;

function loadTexture(url, { colorSpace = THREE.NoColorSpace } = {}) {
  return new Promise((resolve, reject) => {
    textureLoader.load(
      url,
      (tex) => {
        // glTF UVs assume textures are not flipped vertically.
        tex.flipY = false;
        tex.colorSpace = colorSpace;
        resolve(tex);
      },
      undefined,
      reject,
    );
  });
}

function applyTexturesToScene(root, textures) {
  let matched = 0;

  root.traverse((obj) => {
    if (!obj.isMesh) return;

    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of materials) {
      if (!mat) continue;
      const matName = (mat.name || '').toLowerCase();

      // Color/albedo
      if (matName.includes('color') || matName.includes('albedo') || matName.includes('base')) {
        if ('map' in mat) mat.map = textures.TVColor;
        matched++;
      }

      // Metallic
      if (matName.includes('metal') || matName.includes('metalic')) {
        if ('metalnessMap' in mat) mat.metalnessMap = textures.TVMetallic;
        matched++;
      }

      // Roughness
      if (matName.includes('rough') || matName.includes('roughness')) {
        if ('roughnessMap' in mat) mat.roughnessMap = textures.TVRoughness;
        matched++;
      }

      // Screen static / emissive texture
      if (matName.includes('static') || matName.includes('screen') || matName.includes('emissive')) {
        if ('emissiveMap' in mat) mat.emissiveMap = textures.TVStatic;
        if ('emissive' in mat) mat.emissive = new THREE.Color(0xffffff);
        if ('emissiveIntensity' in mat) mat.emissiveIntensity = 1.5;
        matched++;
      }

      // Cabinet / wood
      if (matName.includes('wood') || matName.includes('cabinet') || matName.includes('frame')) {
        if ('map' in mat) mat.map = textures.WoodDarkBrown;
        matched++;
      }

      if (matched > 0) mat.needsUpdate = true;
    }
  });

  // If we didn't find any likely material names, apply a reasonable default to any PBR material.
  if (matched === 0) {
    const materialNames = new Set();

    root.traverse((obj) => {
      if (!obj.isMesh) return;
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const mat of materials) {
        if (!mat) continue;
        materialNames.add(mat.name || '(unnamed)');

        const looksPBR =
          ('metalnessMap' in mat) ||
          ('roughnessMap' in mat) ||
          ('emissiveMap' in mat);
        if (!looksPBR) continue;

        if ('map' in mat) mat.map = textures.TVColor;
        if ('metalnessMap' in mat) mat.metalnessMap = textures.TVMetallic;
        if ('roughnessMap' in mat) mat.roughnessMap = textures.TVRoughness;
        if ('emissiveMap' in mat) mat.emissiveMap = textures.TVStatic;
        if ('emissive' in mat) mat.emissive = new THREE.Color(0xffffff);
        if ('emissiveIntensity' in mat) mat.emissiveIntensity = 1.5;
        mat.needsUpdate = true;
      }
    });

    console.log('No material-name matches; applied default textures to PBR-like materials.', {
      materialNames: Array.from(materialNames).slice(0, 50),
    });
  }
}

const textureUrls = {
  // Source texture assets shipped with the repo.
  TVStatic: new URL('./source/TV/Static.jpeg', import.meta.url).href,
  TVColor: new URL('./source/TV/TVColor.jpg', import.meta.url).href,
  TVMetallic: new URL('./source/TV/TVMetalic.jpg', import.meta.url).href,
  TVRoughness: new URL('./source/TV/TVRoughness.jpg', import.meta.url).href,

  // Optional fallback if the model uses it.
  WoodDarkBrown: new URL('./textures/WoodDarkBrown_3.jpeg', import.meta.url).href,
};

const texturesPromise = Promise.all([
  loadTexture(textureUrls.TVColor, { colorSpace: THREE.SRGBColorSpace }),
  loadTexture(textureUrls.TVMetallic, { colorSpace: THREE.NoColorSpace }),
  loadTexture(textureUrls.TVRoughness, { colorSpace: THREE.NoColorSpace }),
  loadTexture(textureUrls.TVStatic, { colorSpace: THREE.SRGBColorSpace }),
  loadTexture(textureUrls.WoodDarkBrown, { colorSpace: THREE.SRGBColorSpace }),
]).then(([TVColor, TVMetallic, TVRoughness, TVStatic, WoodDarkBrown]) => ({
  TVColor,
  TVMetallic,
  TVRoughness,
  TVStatic,
  WoodDarkBrown,
}));

loader.load(modelUrl, async function (gltf) {
  const textures = await texturesPromise;
  applyTexturesToScene(gltf.scene, textures);
  tv_group.add(gltf.scene);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

console.log('TV loaded');
