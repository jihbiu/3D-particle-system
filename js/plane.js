import * as THREE from 'three';
import { SingletonData } from './singletonData.js';
export class Plane extends THREE.Object3D{
    constructor(pos, geometry, material, size){
        super();
        
        const singletonData = new SingletonData();
        this.scene = singletonData.getScene();

        this.name = "plane";
        this.position.set(pos.x, pos.y, pos.z);

        this.size = size;

        let mesh = new THREE.Mesh(geometry, material);
    
        mesh.receiveShadow = true;
        
        mesh.position.set(pos.x, pos.y, pos.z);

        this.add(mesh);
        this.scene.add(this);
    }
}

