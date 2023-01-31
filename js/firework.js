import * as THREE from 'three';
import { Light } from 'three';
import { FountainEmitter } from './fountainEmitter';
import { SingletonData } from './singletonData.js';
import { ExplosionEmitter } from './explosionEmitter';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
export class Firework extends THREE.Object3D{
    constructor(
        pos,
        timeToExplosion,
        textureBodyFirework,
        height,
        radius,
        smokeColorContainer,
        explosionColorContainer,
        explosionGeometry
        ){
        super();

        const singletonData = new SingletonData();
        this.scene = singletonData.getScene();
    
        this.pos = pos;
        this.position.set(pos.x, pos.y, pos.z);

        this.mass = 1;
        this.particleSize = height/4;

        this.particleContainer = singletonData.getParticleContainer();
        this.gravityParticleContainer = singletonData.getGravityParticleContainer();
        this.emitterContainer = singletonData.getEmitterContainer();
        this.lightContainer = singletonData.getLightContainer();
        this.smokeColorContainer = smokeColorContainer;

        this.explosionColorContainer = explosionColorContainer;
        this.explosionGeometry = explosionGeometry

        this.timeToExplosion = timeToExplosion;
        this.age = 0.0;
        this.isAlive = true;
        this.isExploded = false;
        this.isStarted = false;

        this.radius = radius;
        this.height = height;

        this.forceVector = new THREE.Vector3(0,0,0);
        this.speedVector = new THREE.Vector3(0,0,0);
        

        let geometryCylinder = new THREE.CylinderGeometry( 
            radius * (3 / 5),
            radius * (3 / 5),
            height,
            32
        );
        let materialBodyOfFirework = new THREE.MeshLambertMaterial( {
            map: textureBodyFirework,
         } );
        let meshBodyOfFirework = new THREE.Mesh(
            geometryCylinder,
            materialBodyOfFirework
        );


        let geometryCone = new THREE.ConeGeometry(
            radius,
            height/4, 32
        );
        let materialHeadOfFirework = new THREE.MeshLambertMaterial( {
            color: 0x632036
        });
        let meshHeadOfFirework = new THREE.Mesh(
            geometryCone,
            materialHeadOfFirework
        );

        
        meshBodyOfFirework.position.set(0, height / 2, 0);
        meshHeadOfFirework.position.set(0, height + height / 8, 0);

        this.add(meshBodyOfFirework);
        this.add(meshHeadOfFirework);
        
        this.scene.add(this);


        this.fuseEmitter = new FountainEmitter(
            new THREE.Vector3(this.position.x, this.position.y, this.position.z),
            0.05,
            new THREE.Vector3(5, 0, 5),
            new THREE.Vector2(-3, 3),
            new THREE.Vector2(-4, 0),
            new THREE.Vector2(-3, 3),
            new THREE.Color(0xdbd4d3),
            this.particleSize,
            5,
            0,
            0.6,
            timeToExplosion,
            new THREE.MeshLambertMaterial({
                color: parseInt(this.smokeColorContainer[0]),
                transparent: true,
                opacity: 0.6
            }),
            new THREE.SphereGeometry(
                this.particleSize, 8, 8
            ),
            this.gradientFireColors
        );

        this.fuseLight = new THREE.PointLight(0xe88d4d, 2, 20, 1);
        this.fuseLight.position.set(this.position.x , this.position.y, this.position.z);
        this.fuseLight.castShadow = false;

    }
    
    
    update(dt){
        if(!this.isExploded && this.speedVector.y != 0){

            if(!this.isStarted){
                this.isStarted = true;
                this.scene.add(this.fuseLight);
            }

            this.fuseEmitter.position.set(this.position.x, this.position.y , this.position.z);
            this.fuseLight.position.set(this.position.x, this.position.y , this.position.z);
            this.fuseEmitter.update(dt);

            this.age += dt;
            if(this.age > this.timeToExplosion){
                this.scene.remove(this.fuseLight);
                this.isAlive = false;
                this.age = 0;

                this.emitterContainer.push(
                    new ExplosionEmitter(
                        this.position,
                        10,
                        new THREE.Color(0xdbd4d3),
                        1,
                        2.6,
                        new THREE.MeshBasicMaterial({
                            color: parseInt(this.explosionColorContainer[1])
                        }),
                        new THREE.SphereGeometry(
                            0.5, 8, 8
                        ),
                        this.explosionColorContainer,
                        this.explosionGeometry
                    )
                )

            }
        }
    }



}

/*
4-Czy są uwzględnione różne emitery np.. losowe, w danym kierunku, emiter z koła itp.?
5-Czy jest uwzględniona siła zewnętrzna wpływająca na wszystkie cząsteczki
z danego emitera?
6-Czy cząsteczki mogą kolidować ze sferą/kołem lub innym obiektem 
zdefiniowanym w systemie?7-Rozwiązanie 3d?2)
Używając opracowanego kodu stwórz zapętloną scenę świąteczną w 3D
(lub inną wporozumieniu z prowadzącym)
z minimum 2 rodzajami efektu (np. ogień, dym, wiatr,eksplozja, fajerwerki, etc.).
Mile widziane efekty graficzne (tło?) 
i muzyka pasująca doklimatu. 
Najlepsze prace zostaną zamieszczone w mediach społecznościowych
lub (jeśli czaspozwoli) na korytarzu na parterze. Zachęcam do podpisania
 pracy “na ekranie”.Punktujemy:1-Jakość wykonania2-zgodność z ww założeniami
  (min. 2 efekty, scena 3D)3-oryginalność (10-20%)
   -pomysły można dyskutowac w trakcie laboratorium
*/