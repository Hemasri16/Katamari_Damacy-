// Import necessary libraries
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Ground from './objects/Ground';
import Football from './objects/Football';
import ObjectModule from './objects/Object';
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 10;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cssRenderer = new CSS2DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = "absolute";
cssRenderer.domElement.style.top = "0";
document.body.appendChild(cssRenderer.domElement);

// Set up the physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);  // Standard gravity

// Load models and objects
const gltfLoader = new GLTFLoader();
Ground.create(scene, world, gltfLoader);
Football.create(scene, world, gltfLoader);
ObjectModule.create(scene, world);

ObjectModule.setFootball(Football);

animate();
// Handle window resizing
window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
};

// Function to create boundary walls
function createBoundary(x, y, z, width, height, depth) {
    const wallShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
    const wallBody = new CANNON.Body({
        mass: 0,  // Static walls
        position: new CANNON.Vec3(x, y, z)
    });
    wallBody.addShape(wallShape);
    world.addBody(wallBody);

    const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), wallMaterial);
    wallMesh.position.copy(wallBody.position);
    scene.add(wallMesh);
}

// Create boundaries around the ground
createBoundary(0, 1, 5, 10, 2, 0.2); // North wall
createBoundary(0, 1, -5, 10, 2, 0.2); // South wall
createBoundary(5, 1, 0, 0.2, 2, 10); // East wall
createBoundary(-5, 1, 0, 0.2, 2, 10); // West wall

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 0);
scene.add(directionalLight);

// Animation loop
function animate ()  {
    requestAnimationFrame(animate);
    world.step(1 / 60); // Update physics
    Football.animate(camera);
    // Update specific animations
    ObjectModule.update();
    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);
};

animate();
