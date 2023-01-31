import * as THREE from 'three';
import { Emitter } from './emitter.js';
import {Particle} from './particle.js';
import { SingletonData } from './singletonData.js';

export class CloudEmitter extends Emitter  {
    constructor(
        pos,
        size3f,
        intensityOfRain) {
        super(pos);

        const singletonData = new SingletonData();
        this.scene = singletonData.getScene();

        this.waterParticleContainer = singletonData.getGravityParticleContainer();
        this.collisionParticleContainer = singletonData.getCollisionParticleContainer();

        let geometries = [];
        let materialC = [];
        let meshes = [];

        this.size3f = size3f;

        this.intensityOfRain = intensityOfRain;

        this.particleSize = 1;

        //Init cloud look
        let numOfCircles = (size3f.y / 30) * (size3f.x * size3f.z) / 5;
        for(var i = 0; i < numOfCircles; i++){
            geometries.push(new THREE.SphereGeometry(4, 8, 8));
        }
        
        materialC = new THREE.MeshLambertMaterial({
             color: 0xfdfdfd,
              transparent: true,
               opacity: 0.7 });
        
        
        geometries.forEach(it =>{
            meshes.push(new THREE.Mesh(it, materialC));
        });

        meshes.forEach(it => {
            let positionOfSphere = new THREE.Vector3();
            positionOfSphere.x = THREE.MathUtils.randFloat(0, size3f.x);
            positionOfSphere.y = THREE.MathUtils.randFloat(0, size3f.y);
            positionOfSphere.z = THREE.MathUtils.randFloat(0, size3f.z);
            
            it.position.set(
                positionOfSphere.x,
                positionOfSphere.y,
                positionOfSphere.z,
                );
            this.add(it);

        });
        this.scene.add(this);
    }

    emitParticle(){
        let particle = new Particle(
            new THREE.SphereGeometry(0.2, 6, 6),
            new THREE.MeshStandardMaterial({ 
                color: 0x000fff 
            }),
            new THREE.Vector3(
                THREE.MathUtils.randFloat(this.position.x, this.position.x + this.size3f.x),
                THREE.MathUtils.randFloat(this.position.y, this.position.y + this.size3f.y / 4),
                THREE.MathUtils.randFloat(this.position.z, this.position.z + this.size3f.z)
            ),
            THREE.MathUtils.randFloat(3, 7),
            500,
            this.particleSize
        );

        //particle.speedVector.x = this.velocity.x + (this.spread.x);
        //particle.speedVector.y = this.velocity.y; //+ (this.spread.y * randY);
        //particle.speedVector.z = this.velocity.z + (this.spread.z);

        this.scene.add(particle);
        this.waterParticleContainer.push(particle);
        this.particleContainer.push(particle);
        this.collisionParticleContainer.push(particle);
    }


    update(dt){
        this.emitTimmer += dt;
    
        if(this.emitTimmer > this.intensityOfRain){
            this.emitParticle();
            this.emitTimmer = 0;
        }
    }
    
}