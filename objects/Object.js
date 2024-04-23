import * as THREE from 'three';

const Object = {
  objects: [],

  create: (scene) => {
    const gridSize = 5;
    const gap = 1.5;
    const startX = -5;
    const startY = 0.25;
    const startZ = -5;
    const objectSize = 0.5;

    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff]; // Different colors for objects

    const geometries = [
      new THREE.BoxGeometry(objectSize, objectSize, objectSize),
      // Add more geometries as needed
    ];

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const geometryIndex = Math.floor(Math.random() * geometries.length);
        const geometry = geometries[geometryIndex];

        const colorIndex = Math.floor(Math.random() * colors.length);
        const color = colors[colorIndex];

        const posX = startX + i * gap;
        const posY = startY;
        const posZ = startZ + j * gap;

        const material = new THREE.MeshPhongMaterial({ color: color }); // Phong material with different colors
        const object = new THREE.Mesh(geometry, material);

        object.position.set(posX, posY, posZ);
        scene.add(object);

        Object.objects.push(object);
      }
    }
  },

  // Other methods remain the same
};

export default Object;
