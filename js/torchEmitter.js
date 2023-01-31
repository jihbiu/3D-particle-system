import * as THREE from 'three';
import { Emitter } from './emitter.js';
import {Particle} from './particle.js';
import {Updater} from './updater.js';
import { SingletonData } from './singletonData.js';

export class TorchEmitter extends Emitter  {
    constructor(
        pos,
        height,
        textureTorch,
        textureCoal,
        gradientFireColors,
        torchLight
        ) {
        super(pos);

        const singletonData = new SingletonData();
        this.scene = singletonData.getScene();

        this.fireParticleContainer = singletonData.getFireParticleContainer();
        this.gradientFireColors = gradientFireColors;

        this.torchLight = torchLight;


        //particle values
        this.particleSize = height/10;
        this.velocity = new THREE.Vector3(0, height, 0);
        this.particleSpeed = new THREE.Vector2(height / 10,  height/ 8);

        //size of the torch
        this.height = height;
        this.widthOfTorch = height/8;
        
        //position of lower and upper part of the torch
        this.lowerEndY = height / 2  ;
        this.upperEndY = height + height / 20 ;

        //creating geometries 
        let geometryLowerPart = new THREE.BoxGeometry(
            this.widthOfTorch,
            height,
            this.widthOfTorch
        );
        let geometryUpperPart = new THREE.BoxGeometry(
            this.widthOfTorch,
            height / 10,
            this.widthOfTorch
        );

        //creating "textures"
        let materialTorch = new THREE.MeshPhysicalMaterial( {
            map: textureTorch
         } );
         let materialCoal = new THREE.MeshPhysicalMaterial( {
            map: textureCoal
         } );

         //creating the mesh for our object
        let meshT = new THREE.Mesh(geometryLowerPart, materialTorch);
        let meshC = new THREE.Mesh(geometryUpperPart, materialCoal);

        //setting the base offset of the position
        meshT.position.set(0, this.lowerEndY, 0);
        meshC.position.set(0, this.upperEndY, 0);

        this.add(meshT);
        this.add(meshC);
        this.scene.add(this);
        
    }

    emitParticle(){
        let posOfParticle = Updater.randomPointInCirlce(this.widthOfTorch + this.widthOfTorch / 10);

        let distanceFromCenter = Math.abs(posOfParticle.x) > Math.abs(posOfParticle.y)? Math.abs(posOfParticle.x) : Math.abs(posOfParticle.y)
        
        let timeOfParticle = 1 / (distanceFromCenter * 2);

        let particle = new Particle(
            new THREE.SphereGeometry(this.particleSize, 4, 4),
            new THREE.MeshBasicMaterial({ 
                transparent: true, 
                opacity: 0.5,
                color: parseInt(this.gradientFireColors[0]) ,
            }),
            new THREE.Vector3(
                this.position.x + posOfParticle.x,
                this.position.y + this.upperEndY,
                this.position.z  + posOfParticle.y
            ),
            THREE.MathUtils.randFloat(1.3, 2),
            THREE.MathUtils.randFloat(timeOfParticle / 2, timeOfParticle),
            this.particleSize,
            this.gradientFireColors
        );

        particle.speedVector.x = this.velocity.x; 
        particle.speedVector.y = this.velocity.y + distanceFromCenter * distanceFromCenter / 1.4; 
        particle.speedVector.z = this.velocity.z; 

        this.scene.add(particle);
        this.fireParticleContainer.push(particle);
        this.particleContainer.push(particle);
    }


    update(dt){

        this.emitTimmer += dt;

        this.torchLight.position.set(this.position.x, this.position.y + this.height, this.position.z);

        if(this.emitTimmer > 0.01){
            this.emitParticle();
            this.emitTimmer = 0;
        }
    }
    
}