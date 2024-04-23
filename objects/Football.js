import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

let sphereBody;
let football;
const cameraOffset = new THREE.Vector3(0, 0.5, 1.2);
const resetBtnOffset = new THREE.Vector3(-0.02, 0.2, 0);
const title = document.getElementById("title");
const blinker = document.getElementsByClassName("dot")[0];

function create(scene, world, loader) {
  sphereBody = new CANNON.Body({
    mass: 5,
    shape: new CANNON.Sphere(0.13),
    material: new CANNON.Material(),
    position: new CANNON.Vec3(0, 10, 2),
    angularVelocity: new CANNON.Vec3(10, 0, 0),
    linearDamping: 0.2,
    angularDamping: 0.5
  });
  
  sphereBody.material.restitution = 0.5;
  world.addBody(sphereBody);
  
  loader.load('football/scene.gltf', (gltf) => {
    football = gltf.scene;
    const scale = 0.003;
    football.scale.set(scale, scale, scale);
    scene.add(gltf.scene);
  });

  setupResetBtn(scene);
}

let resetBtn;
function setupResetBtn(scene) {
  const btn = document.createElement("button");
  btn.innerHTML = "";
  btn.className = "";
  btn.style.border = "none";

  btn.onclick = () => {
    sphereBody.position.set(0, 10, 2);
    sphereBody.velocity.set(0, 0, 0);
    sphereBody.angularVelocity.set(10, 0, 0);
  };

  resetBtn = new CSS2DObject(btn);
  scene.add(resetBtn);
}

function animate(camera) {
  if (football && resetBtn) {
    football.position.copy(sphereBody.position);
    football.quaternion.copy(sphereBody.quaternion);

    const dist = sphereBody.position.distanceTo(new CANNON.Vec3(0, 0, 2));
    resetBtn.element.style.opacity = dist > 1 ? 1 : 0;
    resetBtn.position.copy(sphereBody.position).add(resetBtnOffset);

    camera.position.copy(sphereBody.position).add(cameraOffset);
  }
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      sphereBody.velocity.z = -3;
      break;
    case 'ArrowDown':
      sphereBody.velocity.z = 3;
      break;
    case 'ArrowLeft':
      sphereBody.velocity.x = -3;
      break;
    case 'ArrowRight':
      sphereBody.velocity.x = 3;
      break;
  }
});

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'ArrowDown':
      sphereBody.velocity.z = 0;
      break;
    case 'ArrowLeft':
    case 'ArrowRight':
      sphereBody.velocity.x = 0;
      break;
  }
});

export default { create, animate };
