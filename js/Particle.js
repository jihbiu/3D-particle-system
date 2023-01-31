import * as THREE from 'three';
export class Particle extends THREE.Object3D {
    constructor(
        geometry,
        material,
        pos,
        mass, 
        lifeSpan,
        radius,
        colorContainer = null,
        ){
        super();

        this.pos = pos;
        this.position.set(pos.x, pos.y, pos.z);
        this.radius = radius;

        this.material = material;

        this.colorContainer = colorContainer;

        this.geometry = geometry;

        // Create the sphere mesh
        let mesh = new THREE.Mesh(this.geometry, this.material);

        mesh.position.set(0, 0, 0);

        mesh.castShadow = true;

        this.add(mesh);


        //position vector is inherited from THREE.Object3D
        this.speedVector = new THREE.Vector3(0, 0, 0);
        this.forceVector = new THREE.Vector3(0, 0, 0);
        
        this.mass = mass;
        this.maxSpeed = 10000;

        this.age = 0.0;
        this.lifeSpan = lifeSpan;
        this.isAlive = true;

    }
}