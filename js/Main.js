class Main{
    constructor(camera, scene, renderer){
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        
        document.body.appendChild(this.renderer.domElement );

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default 

        this.renderer.render(this.scene, this.camera);

        this.light = new THREE.DirectionalLight( 0xffffff, 1 );
        this.light.position.set( 0, 1, 0 ); //default; light shining from top
        this.light.castShadow = true; // default false


        //this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.clock = new THREE.Clock();
        
        this.emitterContainer = [];
        this.particleContainer = [];
        this.sceneObjContainer = [];


        this.mouse = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster();
        
        this.particleContainer.push(
            new Particle(
                10.0, 32, 16,
                new THREE.MeshStandardMaterial({ 
                    color: 0xff0000 
                })
            ));
                    
            
        this.gravity = 10.0;
        
        this.sceneObjContainer.push(new Plane(
            new THREE.Vector2(10, 10),
            new THREE.Vector3(0, 0, 0),
        ));



        //this.renderer.domElement.addEventListener('click', this.onClick);
    }

    run(){
        renderer.setAnimationLoop(() => {
            this.processEvents();
            this.update();
            this.render();
        });
    }

    processEvents(){
        //this.controls.update();
    }

    update(){
        var dt = this.clock.getDelta();
        this.particleContainer.forEach(particle =>{
            //particle.turnGravity(this.gravity, dt);
            
            updater.limitSpeed(particle);

            updater.aerodynamicForce(particle, 0.001, dt);

            updater.updateSpeed(particle, dt);


            updater.updatePosition(particle, dt);


            //if(updater.agingProcess(particle, dt)){
            //    this.particleContainer.
            //}
            //particle.update(dt);
            //particle.position.x = this.mouse.x;
            //particle.position.y = this.mouse.y;
        })

    }

    render(){
        this.scene.add(new THREE.AxesHelper(10));

        this.sceneObjContainer.forEach(obj => {
            this.scene.add(obj);
        });

        this.particleContainer.forEach(particle => {
            this.scene.add(particle);
        });

        
        this.scene.add(this.light);
        
        this.light.shadow.mapSize.width = 512; // default
        this.light.shadow.mapSize.height = 512; // default
        this.light.shadow.camera.near = 0.5; // default
        this.light.shadow.camera.far = 500; // default

        this.renderer.render(this.scene, this.camera);
    }

    onClick(event){
        // Calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        console.log("mouse position: (" + this.mouse.x + ", "+ this.mouse.y + ")");

        // Update the raycaster with the new mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Calculate objects intersecting the ray
        const intersects = this.raycaster.intersectObjects(this.particleContainer);//this.scene.children);

        if (intersects.length > 0) {
        // The first intersected object is the closest one
          const object = intersects[0].object;

        // Do something with the object
          object.material.color.set(0x00ff00);
        }
    }

    onDocumentMouseMove(event){
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    onWindowResize(event){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    onDocumentKeyDown(event){
        var keyCode = event.which;
        
        //
        if(keyCode == 87){
            this.particleContainer.forEach(particle =>{
                updater.applyForce(
                    particle,
                    new THREE.Vector3(500.1,0.0,0.0)
                );
            });
        }
    }
}

/*
Zadanie programistyczne, technologia dowolna. Oddajemy kod + animację (mp4).

1. Napisz program do symulacji N=1000 dysków poruszających się w obu kierunkach z odbiciami od brzegów. Dysk powinien odbijać się tak, aby nie wystawać poza brzegi. Użyj metody Eulera omawianej na wykładzie. Dyski powinny mieć różne (np. losowe) parametry (masy, średnice oraz kolory przy wizualizacji).

2. Dodaj siłę przyciągającą punkty do środka układu (cx,cy). Użyj siły F~1/r**2 skierowanej do punktu (cx, cy), gdzie r jest odległością między dyskiem, a środkiem układu.

3. Dodaj siłę oporu aerodynamicznego (użyj formuły Stokesa dla niskich liczb Reynoldsa): https://pl.wikipedia.org/wiki/Opór_aero(hydro)dynamiczny Wykonaj symulację z niejednorodnym przestrzennym rozkładem płynu (np. Opór zmienia się w zależności od położenia).

4. Dodaj interakcję z użytkownikiem (ustawienie punktu przyciągania, dodawanie punktów przyciągania, przesuwanie dysków, parametry symulacji itp.)

Zadania na dodatkowe punkty:

5. Dopisz kolizje między punktami (użyj np. wirtualnych sprężyn i/lub wzorów analitycznych na kolizję dwóch dysków: https://en.wikipedia.org/wiki/Elastic_collision).

6. Dodaj interakcję pomiędzy punktami, np. przyciąganie grawitacyjne.

7. Zaproponuj własne rozszerzenie (model, zjawisko) do opracowanej symulacji.*/