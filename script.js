import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'

document.body.style.margin = '0'

const renderer = new CSS3DRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 200, 500)
camera.lookAt(0, 0, 0)
scene.add(camera)

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement)

const tvGroup = new THREE.Group()
scene.add(tvGroup)

const blackBox = new THREE.Mesh(
  new THREE.BoxGeometry(400, 200, 200),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
)
tvGroup.add(blackBox)

const tv_buttons = Array.from(Array(3)).map((_, i) => {
  const button = new THREE.Mesh(
    new THREE.BoxGeometry(25, 25, 10),
    new THREE.MeshBasicMaterial({ color: 0xff9900 })
  )
  // button.position.set(1.5, -1 + .5 * i + 0.5, 1)
  return button
}).map((mesh) => tvGroup.add(mesh))

// Render the scene
function animate() {
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(animate)
}
animate()

class Button extends CSS3DObject {
  constructor({ text = 'button', onclick = () => { } } = {}) {
    const div = document.createElement('div')

    const button = document.createElement('button')
    button.textContent = text
    button.addEventListener('click', () => onclick?.())
    div.append(button)

    super(div)
  }
}

function Element(id, x, y, z, rz) {
  console.log('Element', { id, x, y, z, ry: rz })

  const div = document.createElement('div')
  div.style.width = '480px'
  div.style.height = '360px'
  div.style.backgroundColor = '#000'

  const iframe = document.createElement('iframe')
  iframe.style.width = '480px'
  iframe.style.height = '360px'
  iframe.style.border = '0px'
  iframe.src = ['https://www.youtube.com/embed/', id, '?rel=0'].join('')
  div.appendChild(iframe)

  return new CSS3DObject(div)
}

const elements = []

const appendElement = (id) => {
  const el = new Element(id, 0, 0, 240, -2 * Math.PI)
  tvGroup.add(el)
  elements.push(el)
}

appendElement('SJOz3qjfQXU')

// scene.add(new Button({ text: 'youtube 1', onclick: () => alert('youtube') }))
