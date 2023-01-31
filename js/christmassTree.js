import * as THREE from 'three';
import { SingletonData } from './singletonData.js';
export class ChristmassTree extends  THREE.Object3D{
    constructor(pos, texture){
        super();

        const singletonData = new SingletonData();
        this.scene = singletonData.getScene();
        
        this.position.set(pos.x, pos.y, pos.z);

        this.height = THREE.MathUtils.randInt(15, 25);

        this.texture = texture;

        let geometryTrunk = new THREE.CylinderGeometry( 
            this.height/30,
            this.height/30,
            this.height,
            32
        );
        let materialOfTrunk = new THREE.MeshLambertMaterial( {
            color: 0x4a3118
        });
        this.treeTrunk = new THREE.Mesh(
            geometryTrunk,
            materialOfTrunk
        )
        this.treeTrunk.position.y += this.height / 2;


        let geometryLeavesLower = new THREE.ConeGeometry(
            this.height / 2.6,
            this.height / 2.2,
            32 
        );
        let geometryLeavesMiddle = new THREE.ConeGeometry(
            this.height / 3,
            this.height / 2,
            32 
        );
        let geometryLeavesUpper = new THREE.ConeGeometry(
            this.height / 4,
            this.height / 2,
            32 
        );

        let materialOfLeaves = new THREE.MeshLambertMaterial( {
            map: this.texture,
            color: 0x3b5927
        });
        this.treeLeavesLower = new THREE.Mesh(
            geometryLeavesLower,
            materialOfLeaves
        )
        this.treeLeavesMiddle = new THREE.Mesh(
            geometryLeavesMiddle,
            materialOfLeaves
        )
        this.treeLeavesUpper = new THREE.Mesh(
            geometryLeavesUpper,
            materialOfLeaves
        )
        this.treeLeavesLower.position.y += this.height/2 - this.height/10;
        this.treeLeavesMiddle.position.y += this.height/2 + this.height/5;
        this.treeLeavesUpper.position.y += this.height/1;


        this.add(this.treeTrunk);
        this.add(this.treeLeavesLower);
        this.add(this.treeLeavesMiddle);
        this.add(this.treeLeavesUpper);

        this.scene.add(this);
    }   
}