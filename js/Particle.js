class Particle extends THREE.Object3D {
    constructor(radius, widthSegments, heightSegments, material){
        super();

        this.radius = radius;

        let geometry = new THREE.SphereGeometry(
            radius, widthSegments, heightSegments
        );
  
        // Create the sphere mesh
        let mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);


        //position vector is inherited from THREE.Object3D
        this.speedVector = new THREE.Vector3(0, 0, 0);
        this.forceVector = new THREE.Vector3(20, 0, 0);
        
        this.mass = 10;
        this.maxSpeed = 1000;

        this.age = 0.0;
        this.lifeSpan = 10;
    }


    // Update the particle's position based on its velocity and acceleration
    update(dt) {

        /*// Limit on speed
        if(this.speedVector.length() > this.maxSpeed){
            this.speedVector.setLength(this.maxSpeed);
        }
        // v = (f/m) * t
        this.speedVector.add(
            (this.forceVector.clone().multiplyScalar(dt))
            .divideScalar(this.mass)
          );*/
        

        //position = velocity * dt
        //this.position.add(this.speedVector.clone().multiplyScalar(dt));
        
        //this.age += dt;
  
        // Return true if the particle is still alive, false if it has expired
        //return this.age < this.life;
    }

    //turnGravity(gravity, dt){
    //    //this.forceVector.y.add(
    //    //    gravity * this.mass * dt
    //    //    );
    //}
    //applyForce(appliedForceVec){
    //    this.forceVector.add(appliedForceVec);
    //}
    
  }