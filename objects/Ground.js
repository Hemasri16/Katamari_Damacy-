import * as THREE from 'three';
import * as CANNON from 'cannon-es';

function create(scene, world) {
  // Create a static physics ground plane
  const groundBody = new CANNON.Body({
    mass: 0,
    material: new CANNON.Material('ground'),
    shape: new CANNON.Plane()
  });
  groundBody.material.restitution = 0.8;
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(groundBody);

  // Create a visible Three.js ground plane with reduced dimensions
  const groundWidth = 15; // Smaller width
  const groundDepth = 15; // Smaller depth
  const groundGeometry = new THREE.PlaneGeometry(groundWidth, groundDepth);
  const groundMaterial = new THREE.MeshPhongMaterial({
    color: 0x777777, // Can adjust color as needed
    side: THREE.DoubleSide
  });
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -1.1; // Ensure this position places the plane below your models if necessary
  scene.add(groundMesh);
}

export default { create };
