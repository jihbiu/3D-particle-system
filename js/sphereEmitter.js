import * as THREE from 'three'
import { SphereGeometry } from 'three';
import { Emitter } from './emitter';
import {Particle} from './particle.js';
import { SingletonData } from './singletonData.js';
import { Updater } from './updater';

export class SphereEmitter extends Emitter{
    constructor(
        pos,
        colors,
        customParticleContainer
        ){
    super(pos);

    console.log(pos);
        const singletonData = new SingletonData();
        this.scene = singletonData.getScene();

        this.age = 0;
        this.colorsContainer = colors;
        this.customParticleContainer = customParticleContainer;
        this.particleContainer = singletonData.getParticleContainer();

        console.log(this.colors);

        this.radius = 10;

        this.particleGeometry = new THREE.SphereGeometry(
            0.2, 8, 8
        );
        //this.particleMaterial = new THREE.MeshBasicMaterial({
        //    color: colorsContainer.at(0)
        //});

        this.geometry = new THREE.SphereGeometry(
            this.radius, 10, 10
        );
        this.material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        });
        this.mesh = new THREE.Mesh(
            this.geometry,
            this.material
        );

        this.mesh.position.set(
            pos.x, 
            pos.y,
            pos.z
        );

        this.add(this.mesh);

        //this.scene.add(this.mesh);

    }

    emitParticle(){
        for (let i = 0; i < 50; i++) {
            let particlePosition = Updater.randomPointsOnSphere(this.radius);

            let particle = new Particle(
                this.particleGeometry,
                new THREE.MeshBasicMaterial({
                    color: this.colorsContainer[0]
                }),
                new THREE.Vector3(
                    particlePosition.x + this.position.x,
                    particlePosition.y + this.position.y,
                    particlePosition.z + this.position.z
                ),
                1,
                5,
                1,
                this.colorsContainer
            )
            var randSpeed = THREE.MathUtils.randFloat(-1, 1);
            particle.speedVector = new THREE.Vector3(
                THREE.MathUtils.randFloat(-1, 1),
                THREE.MathUtils.randFloat(-1, 1),
                THREE.MathUtils.randFloat(-1, 1),
            );

            this.scene.add(particle);
            this.customParticleContainer.push(particle);
            this.particleContainer.push(particle);
        }
    }

    update(dt){
        this.age += dt;

        if(this.age > 0.2){ //0.2
            this.emitParticle();
            this.age = 0;
        }
    }
}