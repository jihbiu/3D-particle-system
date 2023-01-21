class updater{
    static limitSpeed(particle){
        if(particle.speedVector.length() > particle.maxSpeed){
            particle.speedVector.setLength(particle.maxSpeed);
        }
    }

    static updateSpeed(particle, dt){
        particle.speedVector.add(
            (particle.forceVector.clone().multiplyScalar(dt))
            .divideScalar(particle.mass)
          );
    }
    
    static updatePosition(particle, dt){
        particle.position.add(particle.speedVector.clone().multiplyScalar(dt));
    }

    static aerodynamicForce(particle, viscosity, dt){
    //    var normCurrentSpeedVec = particle.speedVector.clone().normalize();
    //    var tempValue = particle.forceVector.clone()
    //        .add(particle.speedVector.clone().multiplyScalar(-6 * Math.PI *  viscosity * particle.radius));
//
    //    var normNewSpeedVec = tempValue.clone().normalize();
    //    
    //    if(normCurrentSpeedVec.x  ==  normNewSpeedVec.x){
    //        console.log(normCurrentSpeedVec.x  + " | " +  normNewSpeedVec.x);
    //    }
//
    //    particle.forceVector.add(particle.speedVector.clone().multiplyScalar(-6 * Math.PI *  viscosity * particle.radius));
    //    
    }

    static applyForce(particle, appliedForceVec){
        particle.forceVector.add(appliedForceVec);
    }

    static updateGravity(particle, gravity, dt){
        particle.forceVector.y.add(gravity * this.mass * dt);
    }

    static agingProcess(particle, dt){
        particle.age += dt;
        if(particle.age >= particle.lifeSpan)
            return true;
        else 
            return false;
    }

}
