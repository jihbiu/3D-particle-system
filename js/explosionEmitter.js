import * as THREE from 'three';
import { Emitter } from './emitter.js';
import {Particle} from './particle.js';
import { SingletonData } from './singletonData.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { Updater } from './updater.js';

export class ExplosionEmitter extends Emitter  {
    constructor(
        pos,
        explosionRadius,
        color,
        particleWave,
        particleTime,
        particleMaterial,
        particleGeometry,
        explosionColor,
        explosionGeometry
        ) {
        super(pos);

        const singletonData = new SingletonData();
        this.scene = singletonData.getScene();

        this.noGravityParticleContainer = singletonData.getFireParticleContainer();

        this.particleTime = particleTime;
        
        this.color = new THREE.Color(color);

        this.explosionRadius = explosionRadius;
        this.explosionColor = explosionColor;

        this.age = 0;
        this.currParticleWave = 0; 
        this.particleWave = particleWave;

        this.particleMaterial = particleMaterial;
        this.particleGeometry = particleGeometry;

        this.geometry = explosionGeometry;
        this.material = new THREE.MeshBasicMaterial({});
        this.mesh = new THREE.Mesh(
            this.geometry,
            this.material
        );

        this.mesh.scale.x = explosionRadius;
        this.mesh.scale.y = explosionRadius;
        this.mesh.scale.z = explosionRadius;

        this.add(this.mesh);


        this.explosionLight = new THREE.PointLight(0xe88d4d, 2, 100, 1);
        this.explosionLight.position.set(this.position.x , this.position.y, this.position.z);
        this.explosionLight.castShadow = false;

        this.scene.add(this.explosionLight);

        this.sampler = new MeshSurfaceSampler( this.mesh )
        .build();
    }

    emitParticle(){

        let particlePosition = new THREE.Vector3();

        for (let i = 0; i < 500; i++) {
            this.sampler.sample(particlePosition);
            //particlePosition.add(-0.5);
            particlePosition.multiplyScalar(this.explosionRadius);

            let particle = new Particle(
                this.particleGeometry,
                this.particleMaterial,
                new THREE.Vector3(
                    particlePosition.x / 2 + this.position.x,
                    particlePosition.y / 2 + this.position.y,
                    particlePosition.z / 2 + this.position.z
                ),
                1,
                this.particleTime,
                this.particleSize,
                this.explosionColor
            )
            particle.speedVector = particlePosition.clone(); 

            this.scene.add(particle);
            this.noGravityParticleContainer.push(particle);
            this.particleContainer.push(particle);
            particle.updateMatrix();
        }
    }


    update(dt){
        this.age += dt;

        if(this.age > 0.2){ //0.2
            this.emitParticle();
            this.age = 0;
            this.currParticleWave++;
        }
        if(this.currParticleWave >= this.particleWave){
            this.isAlive = false;
            this.scene.remove(this.explosionLight);
        }
    }
    
}