import * as THREE from 'three';
import { Emitter } from './emitter.js';
import {Particle} from './particle.js';
import { SingletonData } from './singletonData.js';

export class FountainEmitter extends Emitter  {
    constructor(
        pos,
        intensity,
        speedVector, 
        randSpreadX,
        randSpreadY,
        randSpreadZ,
        color,
        particleSize,
        particleTime,
        particleMass,
        particleOpacity,
        emitterLifeTime,
        particleMaterial,
        particleGeometry,
        ) {
        super(pos);

        const singletonData = new SingletonData();
        this.scene = singletonData.getScene();

        this.gravityParticleContainer = singletonData.getGravityParticleContainer();
        this.collisionParticleContainer = singletonData.getCollisionParticleContainer();

        this.speedVector = speedVector;
        
        this.randSpreadX = randSpreadX;
        this.randSpreadY = randSpreadY;
        this.randSpreadZ = randSpreadZ;

        this.intensity = intensity;
        this.particleSize = particleSize; 
        this.particleTime = particleTime;
        this.particleMass = particleMass;
        
        this.color = new THREE.Color(color);

        if(particleMaterial != null){
            this.particleMaterial = particleMaterial;
            this.particleMaterial.color = this.color;
        }
        else{
            this.particleMaterial = new THREE.MeshStandardMaterial({
                color: this.color
            });
        }
        if(particleGeometry != null){
            this.particleGeometry = particleGeometry;
        }
        else{
            this.particleGeometry = new THREE.SphereGeometry(
                this.particleSize, 8, 8
            );
        }


        this.emitterLifeTime = emitterLifeTime;
        this.emitterAge = 0;    
    }

    emitParticle(){
        let particle = new Particle(
            this.particleGeometry,
            this.particleMaterial,
            this.position,
            5,
            this.particleTime,
            this.particleSize
        );
        let randX = THREE.MathUtils.randFloat(-1, 1);
        let randY = THREE.MathUtils.randFloat(-1, 1);
        let randZ = THREE.MathUtils.randFloat(-1, 1);

        particle.speedVector.x = this.speedVector.x * (randX);
        particle.speedVector.y = this.speedVector.y * (randY);
        particle.speedVector.z = this.speedVector.z * (randZ);

        this.scene.add(particle);
        this.gravityParticleContainer.push(particle);
        this.particleContainer.push(particle);
        this.collisionParticleContainer.push(particle);
    }


    update(dt){
        this.emitTimmer += dt;
        this.emitterAge += dt;

        if(this.emitTimmer > this.intensity){
            this.emitParticle();
            this.emitTimmer = 0;
        }
        if(this.emitterAge > this.emitterLifeTime && this.emitterLifeTime != null){
            this.isAlive = false;
        }
    }
    
}