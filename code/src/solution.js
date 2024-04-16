import * as THREE from 'three';

let renderer, scene, camera, ball;

const init = () => {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
  scene.add(directionalLight);

  // Create a sphere geometry for the ball
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  // Create a material for the ball
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  // Create a mesh using the geometry and material
  ball = new THREE.Mesh(geometry, material);
  // Add the ball to the scene
  scene.add(ball);

  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);

  animate(); // Start the animation loop

  // Listen for keyboard input
  document.addEventListener('keydown', onKeyDown);
};

const animate = () => {
  requestAnimationFrame(animate);

  // Render the scene
  renderer.render(scene, camera);
};

const onKeyDown = (event) => {
  // Movement speed
  const speed = 0.1;

  switch (event.key) {
    case 'ArrowRight': // Move forward
      ball.position.z -= speed;
      break;
    case 'ArrowLeft': // Move backward
      ball.position.z += speed;
      break;
    case 'ArrowUp': // Move left
      ball.position.x -= speed;
      break;
    case 'ArrowDown': // Move right
      ball.position.x += speed;
      break;
  }

  // Ensure the ball remains within the visible area of the scene
  const boundingBox = new THREE.Box3().setFromObject(ball);
  const { min, max } = boundingBox;
  const maxX = window.innerWidth / 2;
  const minX = -window.innerWidth / 2;
  const maxZ = window.innerHeight / 2;
  const minZ = -window.innerHeight / 2;

  if (max.x > maxX) {
    ball.position.x -= (max.x - maxX);
  }
  if (min.x < minX) {
    ball.position.x += (minX - min.x);
  }
  if (max.z > maxZ) {
    ball.position.z -= (max.z - maxZ);
  }
  if (min.z < minZ) {
    ball.position.z += (minZ - min.z);
  }
};

window.addEventListener('DOMContentLoaded', init);
