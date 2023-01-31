import * as THREE from 'three';
export class SingletonData{
    constructor() {
        if(SingletonData._instance){
            return SingletonData._instance
        }

        SingletonData._instance = this;
        SingletonData._scene = new THREE.Scene();
        SingletonData._particleContainer = [];
        SingletonData._fireParticleContainer = [];
        SingletonData._gravityParticleContainer = [];
        SingletonData._collisionParticleContainer = [];
        SingletonData._collisionBoxContainer = [];
        SingletonData._emitterContainer = [];
        SingletonData._lightContainer = [];
        SingletonData._sceneObjContainer = [];
        SingletonData._objectsToRemove = [];
        SingletonData._fireworkContainer = [];
        SingletonData._fireworkParticleContainer = [];


    }
    getScene(){
        return SingletonData._scene;
    }
    getParticleContainer(){
        return SingletonData._particleContainer;
    }
    getFireParticleContainer(){
        return SingletonData._fireParticleContainer;
    }
    getGravityParticleContainer(){
        return SingletonData._gravityParticleContainer;
    }
    getCollisionParticleContainer(){
        return SingletonData._collisionParticleContainer;
    }
    getCollisionBoxContainer(){
        return SingletonData._collisionBoxContainer;
    }
    getEmitterContainer(){
        return SingletonData._emitterContainer;
    }
    getLightContainer(){
        return SingletonData._lightContainer;
    }
    getSceneObjContainer(){
        return SingletonData._sceneObjContainer;
    }
    getObjectsToRemove(){
        return SingletonData._objectsToRemove;
    }
    getFireWorkContainer(){
        return SingletonData._fireworkContainer;
    }
    getFireworkParticleContainer(){
        return SingletonData.__fireworkParticleContainer;
    }
}
