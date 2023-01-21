// Emitter class
class Emitter {
    constructor(position,) {
      // Set up the initial state for the emitter
      this.position = position;
      this.velocity = new THREE.Vector3();
      this.spread = new THREE.Vector3();
      this.color = new THREE.Color();

      this.size = 0;
      this.life = 0;
      this.rate = 0;

      this.emitCounter = 0;

      this.particleContainer = [];
    }
  
    // Emit a single particle
    emitParticle() {
      // Create a new particle
      let particle = new Particle();
  
      // Set the particle's initial position, velocity, and acceleration
      particle.position.copy(this.position);
      particle.velocity.copy(this.velocity)
        .add(this.spread.clone().multiplyScalar(Math.random() - 0.5));
      particle.acceleration.copy(this.acceleration);
  
      // Set the particle's initial color and size
      particle.color.copy(this.color);
      particle.size = this.size;
  
      // Set the particle's initial life
      particle.life = this.life;
  
      // Add the particle to the emitter's list of active particles
      this.particles.push(particle);
    }
  
    // Update the emitter
    update(deltaTime) {
      // Update the emission counter
      this.emitCounter += deltaTime;
  
      // Emit particles as necessary
      while (this.emitCounter > this.rate) {
        this.emitParticle();
        this.emitCounter -= this.rate;
      }
  
      // Update the emitter's active particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        if (!this.particles[i].update(deltaTime)) {
          // Remove the particle if it has expired
          this.particles.splice(i, 1);
        }
      }
    }
  }