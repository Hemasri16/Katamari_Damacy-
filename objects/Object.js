import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const ObjectModule = {
    objects: [],
    football: null,
    attachedObjects:[],

    create: function(scene, world) {
        const gridSize = 10; // Defines the grid size for object placement
        const objectSize = 0.2; // Size of each object
        const startY = objectSize / 2; // Start position on Y axis
        const groundSize = 10; // Size of the ground
        const padding = 0.2; // Padding between objects
        const totalPadding = padding * (gridSize - 1);
        const usableArea = groundSize - totalPadding;
        const gap = usableArea / gridSize;

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const posX = (i * (gap + padding)) - (groundSize / 2) + (gap / 2);
                const posZ = (j * (gap + padding)) - (groundSize / 2) + (gap / 2);

                const geometry = new THREE.BoxGeometry(objectSize, objectSize, objectSize);
                const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(posX, startY, posZ);
                scene.add(mesh);

                const shape = new CANNON.Box(new CANNON.Vec3(objectSize / 2, objectSize / 2, objectSize / 2));
                const body = new CANNON.Body({
                    mass: 1,  // Dynamic objects that can move
                    material: new CANNON.Material(),
                    shape: shape,
                    position: new CANNON.Vec3(posX, startY, posZ)
                });
                body.userData = { mesh, type: "dynamic" };
                world.addBody(body);

                this.objects.push(body);

                // Add collision event listener to each dynamic object
                body.addEventListener('collide', this.handleCollision.bind(this));
            }
        }
    },

    setFootball: function(football) {
        this.football = football;
    },

    attachToObject: function(objectBody) {
      // Calculate relative position to the football
      const relativePosition = objectBody.position.vsub(this.football.position);
      this.attachedObjects.push({ body: objectBody, relativePosition });
  },
 handleCollision: function(event) {
    const { bodyA, bodyB } = event;
    let objectBody = (bodyA === this.football) ? bodyB : bodyA;

    if (objectBody && objectBody.userData && objectBody.userData.type === "dynamic") {
        // Check if the collision point is near the surface of the object
        const collisionPoint = event.contact.getImpactPoint(
            new CANNON.Vec3() // Provide a vector to store the impact point
        );

        // Calculate the distance from the collision point to the center of the object
        const distanceToCenter = collisionPoint.distanceTo(objectBody.position);

        // Set a threshold distance to determine if the collision is considered valid
        const threshold = objectBody.shapes[0].boundingSphereRadius * 0.9; // Adjust as needed

        if (distanceToCenter < threshold) {
            // Make the object disappear
            objectBody.userData.mesh.visible = false;
            objectBody.sleep(); // Put the physics body to sleep
        }
    }
},


update: function() {
  // Update the position of attached objects relative to the ball
  this.attachedObjects.forEach(attachedObj => {
      const { body, relativePosition } = attachedObj;
      if (this.football && body.userData.mesh) {
          // Update the position of the mesh based on the relative position to the ball
          const newPos = new THREE.Vector3();
          newPos.copy(this.football.position);
          newPos.add(relativePosition); // Adjust the position based on the relative position
          body.position.copy(newPos);
          body.velocity.set(0, 0, 0); // Reset velocity to prevent objects from drifting
      }
  });
}
};


export default ObjectModule;
