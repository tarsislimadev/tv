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
document.body.appendChild(renderer.domElement); // Add the renderer to the body of the HTML document
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 15;

// Load the model
const loader = new GLTFLoader();

// Resolve the model path relative to this module file.
const tv_group = new THREE.Group();
scene.add(tv_group);

const modelUrl = new URL('./source/TV/TV.glb', import.meta.url).href;
loader.load(modelUrl, function(gltf) {
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
