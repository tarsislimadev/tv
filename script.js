import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

document.body.style.margin = '0'

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5)
camera.lookAt(0, 0, 0);
scene.add(camera);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

const tvGroup = new THREE.Group()
scene.add(tvGroup)

const blackBox = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2, 2),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
);
tvGroup.add(blackBox);

const tv_buttons = Array.from(Array(3)).map((_, i) => {
  const button = new THREE.Mesh(
    new THREE.BoxGeometry(.25, .25, .1),
    new THREE.MeshBasicMaterial({ color: 0xff9900 })
  )
  button.position.set(1.5, -1 + .5 * i + 0.5, 1)
  return button
}).map((mesh) => tvGroup.add(mesh))

// Render the scene
function animate() {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);
}
animate();
