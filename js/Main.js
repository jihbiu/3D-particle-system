import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CloudEmitter } from './cloudEmitter.js';
import { TorchEmitter } from './torchEmitter.js';
import {Plane} from './plane.js';
import {Updater} from './updater.js';
import {Rainbow} from './rainbowvis';
import { FountainEmitter } from './fountainEmitter.js';
import { Firework } from './firework.js';
import { SingletonData } from './singletonData.js';
import { ExplosionEmitter } from './explosionEmitter.js';
import {SphereEmitter} from './sphereEmitter.js';
import { ChristmassTree } from './christmassTree.js';


 // loader for our textures
const loader = new THREE.TextureLoader();

//Set scene from singletonData class so we can get same instance of scene in diffrent files
const singletonData = new SingletonData();
const scene = singletonData.getScene();
scene.background = new THREE.Color(0x7aa0a3);
const textureNightSky = new THREE.TextureLoader().load( "https://t4.ftcdn.net/jpg/03/58/75/17/360_F_358751701_4Gw4SXn8q4fzjgHWz5ZQhZaojoJM8oO2.jpg");
scene.background = textureNightSky;
//scene.add(new THREE.AxesHelper(10));
//scene.fog = new THREE.Fog(
//    new THREE.Color(0xbec7f7), 100 , 1000
//)


//Setup our camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(100);
camera.position.setY(10);
camera.position.setX(0);

//Setup renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default
    
document.body.appendChild(renderer.domElement )

//on click evenets and so on
renderer.domElement.addEventListener('click', onClick);
document.addEventListener('mousemove', onDocumentMouseMove);
window.addEventListener('resize', onWindowResize);
document.addEventListener("keydown", onDocumentKeyDown);



const mouse = new THREE.Vector2()
let raycaster = new THREE.Raycaster();


const controls = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();


//Init main Containers used in program
let emitterContainer            = singletonData.getEmitterContainer();
let particleContainer           = singletonData.getParticleContainer();
let fireParticleContainer       = singletonData.getFireParticleContainer();
let gravityParticleContainer    = singletonData.getGravityParticleContainer();
let sceneObjContainer           = singletonData.getSceneObjContainer();
let collisionParticleContainer  = singletonData.getCollisionParticleContainer();
let collisionBoxContainer       = singletonData.getCollisionBoxContainer();
let objectsToRemove             = singletonData.getObjectsToRemove();
let lightContainer              = singletonData.getLightContainer();
let fireWorkContainer           = singletonData.getFireWorkContainer();

let customParticleContainer = [];


let gravity = new THREE.Vector3(0,-1, 0);



//Base main light
const lightMainWhite = new THREE.AmbientLight( 0x707070, 1.2 ); // soft white light
scene.add(lightMainWhite);


var gradientFireColors = [];
var gradientSmokeColor = [];
var explosionColorsContainer = [];
var explosionGeometryContainer = [];

var customColors = [];

//Loading and initing textures
const textureFireworkBase = loader.load('https://images.template.net/wp-content/uploads/2016/04/19071837/Free-Texture.jpg');
textureFireworkBase.wrapS = THREE.RepeatWrapping;
textureFireworkBase.wrapT = THREE.RepeatWrapping;
textureFireworkBase.repeat.set(1, 1);

const textureTorch = loader.load('https://www.manytextures.com/wallpaper/11/1200/1920/tree-branch-wallpaper.jpg');
textureTorch.wrapS = THREE.RepeatWrapping;
textureTorch.wrapT = THREE.RepeatWrapping;
textureTorch.repeat.set(1, 1);

var textureCoal = loader.load('https://cdn.pixabay.com/photo/2013/02/21/19/12/charcoal-84670__480.jpg');
textureCoal.wrapS = THREE.RepeatWrapping;
textureCoal.wrapT = THREE.RepeatWrapping;
textureCoal.repeat.set(1, 1);

const textureGrass = loader.load('https://i.imgur.com/Ygo0g.png');
textureGrass.wrapS = THREE.RepeatWrapping;
textureGrass.wrapT = THREE.RepeatWrapping;
textureGrass.repeat.set(128,128);

const texturePineTree = loader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAvKgWBS54MtRW4NRCmbh3l9r6fH5wf6z0Qw&usqp=CAU');
texturePineTree.wrapS = THREE.RepeatWrapping;
texturePineTree.wrapT = THREE.RepeatWrapping;
texturePineTree.repeat.set(16,2);


initTorchLightGradientColors();
initSmokeGradientColors();
initExplosionColorsContainer();
initexplosionGeometryContainer();

spawnCloudEmitter(new THREE.Vector3(-75, 100, 0), new THREE.Vector3(150,20,100));

spawnTorchEmitter(new THREE.Vector3(-30, 0, 80));
spawnTorchEmitter(new THREE.Vector3(30, 0, 80));
spawnTorchEmitter(new THREE.Vector3(-15, 0, 85));
spawnTorchEmitter(new THREE.Vector3(15, 0, 85));
spawnFirework(new THREE.Vector3(100, 0, -100));
spawnFirework(new THREE.Vector3(50, 0, -100));
spawnFirework(new THREE.Vector3(0, 0, -100));
spawnFirework(new THREE.Vector3(-50, 0, -100));
spawnFirework(new THREE.Vector3(-100, 0, -100));

//spawnChristmassTree(new THREE.Vector3(0, 0, 10));

initGrassPlane();


//init GUI
//const gui = new GUI();


function run(){

    requestAnimationFrame( run );

    processEvents();
    update();
    render();
}

function processEvents(){
    controls.update();
}

function update(){
    var dt = clock.getDelta();
    //console.log(particleContainer.length);

    emitterContainer.forEach((emitter, index) => {
        if(emitter.isAlive)
            emitter.update(dt);
        else{
            objectsToRemove.push(emitter);
            emitterContainer.splice(index, 1);
        }
    });

    customParticleContainer.forEach((particleA, indexA) => {
        //customParticleContainer.forEach(particleB =>{
        //    Updater.applyForce(particleA, Updater.getGravityForce2Particles(particleA, particleB));
        //});
        Updater.applyForceToPoint(
            particleA,                      //particle that the force will be applied
            new THREE.Vector3(0, 50, -70),  //position of the point
            20                             //mass of that point
         );
        Updater.distanceBasedColor(particleA, new THREE.Vector3(0, 50, -70));
        Updater.aerodynamicForce(particleA, 0.001, dt);

        if(Updater.agingProcess(particleA, dt)){
            particleA.isAlive = false;
            customParticleContainer.splice(indexA, 1);
        }
    })

    fireParticleContainer.forEach((fireParticle, index) =>{
        Updater.updateColor(fireParticle);

        if(Updater.agingProcess(fireParticle, dt)){
            fireParticle.isAlive = false;
            fireParticleContainer.splice(index, 1);
        }
    });

    gravityParticleContainer.forEach((particle, index) =>{
        Updater.updateGravity(particle, gravity, dt);

        if(Updater.agingProcess(particle, dt)){
            particle.isAlive = false;
            gravityParticleContainer.splice(index, 1);
        }
    });


    fireWorkContainer.forEach((firework, index) =>{
        Updater.limitSpeed(firework);
        Updater.updateSpeed(firework, dt);
        Updater.updatePosition(firework,dt);

        if(firework.isAlive != false){
            firework.update(dt);
        }
        else{
            objectsToRemove.push(firework);
            fireWorkContainer.splice(index, 1);
        }
    });

    collisionParticleContainer.forEach((particle, index) =>{
        collisionBoxContainer.forEach(box =>{
            if(Updater.collisionSphereAndBox(particle, box)){
                particle.isAlive = false;
                objectsToRemove.push(particle);
                collisionParticleContainer.splice(index, 1);
            }
        });
    })

    //deleted old particles
    particleContainer.forEach((particle, index) => {
        Updater.limitSpeed(particle);
        Updater.updateSpeed(particle, dt);
        Updater.updatePosition(particle, dt);
        if(!particle.isAlive){
            //objectsToRemove.push(particle);
            particleContainer.splice(index, 1);
            scene.remove(particle);
        }
    })

    objectsToRemove.forEach(obj => {
        scene.remove(obj);
    })
}

function render(){

    renderer.render(scene, camera);
}

function onClick(event){

    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.getObjectByName('plane').children, true);
//
    if (intersects.length > 0){
        console.log(intersects[0].point);
        //spawnTorchEmitter(intersects[0].point);
        spawnFirework(intersects[0].point);
    }
    
}

function onDocumentMouseMove(event){
   //event.preventDefault();
   //mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
   //mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
function onWindowResize(event){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function onDocumentKeyDown(event){
    var keyCode = event.which;

    if(keyCode == 87){  //W key
        particleContainer.forEach(particle =>{
            Updater.applyForce(
                particle,
                new THREE.Vector3(5, 0, 0)
            );
        });

    }
    if(keyCode == 83){  //S key
        fireWorkContainer.forEach(firework =>{
            Updater.applyForce(
                firework,
                new THREE.Vector3(0, 10, 0)
            );
        });
    }   
    if(keyCode == 65){  //A key

    }   
    if(keyCode == 68){  //D key

    }   
    if(keyCode == 82){  //R key

    }   
    if(keyCode == 70){  //F key
        initCustomEmitter()
    }
}

function initGrassPlane(){
    var size = new THREE.Vector3(1000, 2, 1000);

    const plane = new Plane(
        new THREE.Vector3(0, -1 ,0),               //position
        new THREE.BoxGeometry(size.x, size.y, size.z),     //box geometry of size
        new THREE.MeshPhysicalMaterial({           
            map: textureGrass,
        }),
        size
    );

    //init trees;
    for(var i = 0; i < 500; i++){
        sceneObjContainer.push(new ChristmassTree(
            new THREE.Vector3(
                THREE.MathUtils.randInt( -size.x / 2, size.x / 2),
                0,
                THREE.MathUtils.randInt( -size.z / 2, size.z / 2),
            ),
            texturePineTree
        ));
    }


    collisionBoxContainer.push(plane);
    sceneObjContainer.push(plane);
}

function spawnCloudEmitter(position, size){
    emitterContainer.push(
        new CloudEmitter(
            position,
            size,
            0.03
        )
    );
}

function spawnTorchEmitter(position){
    let height = 5;

    var torchLight = new THREE.PointLight(0xe06631, 2, 50, 1);
    torchLight.position.set(position.x , position.y + height + height/8, position.z);
    torchLight.castShadow = false;

    emitterContainer.push(
        new TorchEmitter(
            position,
            height,
            textureTorch,
            textureCoal,
            gradientFireColors,
            torchLight
        )
    );


    lightContainer.push(torchLight);
    scene.add(torchLight);
}

function spawnFirework(position){
    let chooseColor = THREE.MathUtils.randInt(0, explosionColorsContainer.length - 1);
    let chooseGeometry = THREE.MathUtils.randInt(0, explosionGeometryContainer.length - 1);
    let randExplosionTime = THREE.MathUtils.randFloat(3.5, 4.5);
    //let randExplosionGeometry = Tss

    let firework = new Firework(
        new THREE.Vector3(position.x, position.y, position.z),
        randExplosionTime,
        textureFireworkBase,
        4,
        1,
        gradientSmokeColor,
        explosionColorsContainer.at(chooseColor),
        explosionGeometryContainer.at(chooseGeometry)
    );

    fireWorkContainer.push(firework);

}

function spawnChristmassTree(position){
    sceneObjContainer.push(
        new ChristmassTree(
            position,
            texturePineTree
        )
    );
}

function initTorchLightGradientColors(){
    var numberOfItems = 8;
    var rainbow = new Rainbow();
    rainbow.setNumberRange(1, numberOfItems);
    rainbow.setSpectrum('#ff8957', '#5c0800');
    var s = '';

    for (var i = 1; i <= numberOfItems; i++) {
        var hexColour = rainbow.colourAt(i);
        gradientFireColors.push('0x' + hexColour);

    }
    
}

function initSmokeGradientColors(){
    var numberOfItems = 4;
    var rainbow = new Rainbow();
    rainbow.setNumberRange(1, numberOfItems);
    rainbow.setSpectrum('#d1d0cd', '#666362');

    for (var i = 1; i <= numberOfItems; i++) {
        var hexColour = rainbow.colourAt(i);
        gradientSmokeColor.push('0x' + hexColour);

    }
}

function initExplosionColorsContainer(){
    var numberOfItems = 16;

    var raindbowArray = [];

    var rainbow_1 = new Rainbow();
    rainbow_1.setNumberRange(1, numberOfItems);
    rainbow_1.setSpectrum('#26ba4b', '#1465de');
    raindbowArray.push(rainbow_1);

    var rainbow_2 = new Rainbow();
    rainbow_2.setNumberRange(1, numberOfItems);
    rainbow_2.setSpectrum('#d4133d', '#7e08cc');
    raindbowArray.push(rainbow_2);

    var rainbow_3 = new Rainbow();
    rainbow_3.setNumberRange(1, numberOfItems);
    rainbow_3.setSpectrum('#d8de21', '#08cfbb');
    raindbowArray.push(rainbow_3);

    var rainbow_4 = new Rainbow();
    rainbow_4.setNumberRange(1, numberOfItems);
    rainbow_4.setSpectrum('#0274de', '#15d183');
    raindbowArray.push(rainbow_4);

    var rainbow_5 = new Rainbow();
    rainbow_5.setNumberRange(1, numberOfItems);
    rainbow_5.setSpectrum('#8d00de', '#cc236c');
    raindbowArray.push(rainbow_5);

    var rainbow_6 = new Rainbow();
    rainbow_6.setNumberRange(1, numberOfItems);
    rainbow_6.setSpectrum('#f5ffcc', '#8a9171');
    raindbowArray.push(rainbow_6);

    for(var i = 0; i < raindbowArray.length; i++){
        var tempArray = [];

        for (var j = 1; j <= numberOfItems; j++) {
            var hexColour = raindbowArray[i].colourAt(j);
            tempArray.push('0x' + hexColour);
            customColors.push('0x' + hexColour);
        }

        explosionColorsContainer.push(tempArray);
    }
}

function initexplosionGeometryContainer(){
    const explosionGeometryBox = new THREE.BoxGeometry(1, 1, 1);
    const explosionGeometrySphere = new THREE.SphereGeometry(1, 8, 8);
    const explosionGeometryCylinder = new THREE.CylinderGeometry(1, 1 , 2, 8, 8);
    const explosionGeometryTorus = new THREE.TorusGeometry( 1, 0.4, 12, 4);
    const explosionGeometryTorusKnot = new THREE.TorusKnotGeometry(1, 0.1, 23, 10, 2, 5);


    explosionGeometryContainer.push(explosionGeometryBox);
    explosionGeometryContainer.push(explosionGeometrySphere);
    explosionGeometryContainer.push(explosionGeometryCylinder);
    explosionGeometryContainer.push(explosionGeometryTorus);
    explosionGeometryContainer.push(explosionGeometryTorusKnot);
}

function initCustomEmitter(){
    emitterContainer.push(new SphereEmitter(
        new THREE.Vector3(0, 50, -70),
        customColors,
        customParticleContainer
    ));
}

run();

