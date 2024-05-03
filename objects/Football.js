// Football.js

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import ObjectModule from './Object.js'; // Adjust the path as necessary

let sphereBody, football;
const cameraOffset = new THREE.Vector3(0, 0.5, 1.2);

function create(scene, world, loader) {
    // Create the football
    sphereBody = new CANNON.Body({
        mass: 5,
        shape: new CANNON.Sphere(0.20),
        material: new CANNON.Material(),
        position: new CANNON.Vec3(0, 10, 2),
        angularVelocity: new CANNON.Vec3(10, 0, 0),
        linearDamping: 0.2,
        angularDamping: 0.5
    });
    sphereBody.material.restitution = 0.5;
    world.addBody(sphereBody);

    // Load the football model
    loader.load('football/scene.gltf', (gltf) => {
        football = gltf.scene;
        football.scale.set(0.003, 0.003, 0.003);
        scene.add(football);

        ObjectModule.setFootball(sphereBody); // Attach the physics body, not the mesh

        // Add collision event listener to handle object attachment
        sphereBody.addEventListener('collide', function(e) {
            const contactBody = e.body;
            if (contactBody && contactBody.userData && contactBody.userData.type === "dynamic") {
                ObjectModule.attachToObject(contactBody);
            }
        });
    });
}

function animate(camera) {
    if (football) {
        football.position.copy(sphereBody.position);
        football.quaternion.copy(sphereBody.quaternion);
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
