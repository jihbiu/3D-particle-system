import * as THREE from 'three';
import {Particle} from './particle.js';
import { SingletonData } from './singletonData.js';
import {Updater} from './updater.js';

export class Emitter extends THREE.Object3D {
    constructor(pos) {
        super();
        this.position.set(pos.x, pos.y, pos.z);

        const singletonData = new SingletonData();

        this.emitTimmer = 0;
      
        this.particleContainer = singletonData.getParticleContainer();
        
        this.isAlive = true;
    } 
}