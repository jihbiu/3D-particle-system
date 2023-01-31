import * as THREE from 'three';
export class Updater{
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

    static move(obj, vec){
        obj.position.add(vec);
    }

    static updateColor(particle){
        if(particle.colorContainer != null){
            var colorPerTime = particle.lifeSpan / particle.colorContainer.length;
            var currentColorIndex = Math.floor(particle.age / colorPerTime);
            particle.material.opacity = 0.7 - currentColorIndex / 15;
            var colorValue = parseInt ( particle.colorContainer[currentColorIndex]);
            particle.material.color = new THREE.Color(colorValue);
        }
    }

    static distanceBasedColor(particle, position){
        if(particle.colorContainer != null){
            let distance = particle.position.distanceTo(position);
            if(distance > 50){
                particle.isAlive = false;
            }
            var colorPerDistance = (70 / particle.colorContainer.length);

            var currentColorIndex = Math.floor(distance / colorPerDistance);

            var colorValue = parseInt ( particle.colorContainer[currentColorIndex]);
            particle.material.color = new THREE.Color(colorValue);
        }
    }

    //psuedo aerodynamicForce
    static aerodynamicForce(particle, viscosity, dt){

        particle.speedVector.x = THREE.MathUtils.damp(
            particle.speedVector.x,
            0,
            Math.sqrt(Math.abs(particle.speedVector.y)),
            dt
        );
        particle.speedVector.y = THREE.MathUtils.damp(
            particle.speedVector.y,
            0,
            Math.sqrt(Math.abs(particle.speedVector.y)),
            dt
        );
        particle.speedVector.z = THREE.MathUtils.damp(
            particle.speedVector.z,
            0,
            Math.sqrt(Math.abs(particle.speedVector.y)),
            dt
        );
        /*
        var normCurrentSpeedVec = particle.speedVector.clone().normalize();
        var tempValue = particle.forceVector.clone()
            .add(particle.speedVector.clone().multiplyScalar(-6 * Math.PI *  viscosity * particle.radius));
        var normNewSpeedVec = tempValue.clone().normalize();
        
        if(normCurrentSpeedVec.x  ==  normNewSpeedVec.x){
            console.log(normCurrentSpeedVec.x  + " | " +  normNewSpeedVec.x);
        }

        particle.forceVector.add(particle.speedVector.clone().multiplyScalar(-6 * Math.PI *  viscosity * particle.radius));
        */
    }

    static applyForce(particle, appliedForceVec){
        particle.forceVector.add(appliedForceVec);
    }

    static updateGravity(particle, gravity, dt){
     particle.speedVector.add(gravity.clone().multiplyScalar(
            particle.mass * dt 
        ));
    }

    static agingProcess(particle, dt){
        particle.age += dt;
        if(particle.age >= particle.lifeSpan)
            return true;
        else 
            return false;
    }

    static randomPointInCirlce(radius){
        const x = THREE.Math.randFloat( -1, 1 );
        const y = THREE.Math.randFloat( -1, 1 );
        const r = THREE.Math.randFloat( 0.5 * radius, 1.2 * radius );

        const normalizationFactor = 1 / Math.sqrt( x * x + y * y );
           
        const vec = new THREE.Vector2(
            x * normalizationFactor * r,
            y * normalizationFactor * r
        );
 

        return vec;
    }


    static circleInsideSquare(circlePos, circleRadius, boxPos, boxSize){
        let circleDistance = new THREE.Vector2(
            Math.abs(circlePos.x - boxPos.x),
            Math.abs(circlePos.y - boxPos.y)
        )

        if (circleDistance.x > (boxSize.x / 2 + circleRadius)) { return false; }
        if (circleDistance.y > (boxSize.y / 2 + circleRadius)) { return false; }
    
        if (circleDistance.x <= (boxSize.x / 2)) { return true; } 
        if (circleDistance.y <= (boxSize.y / 2)) { return true; }
    
        let cornerDistance_sq = (circleDistance.x - boxSize.x / 2)^2 +
                                (circleDistance.y - boxSize.y / 2)^2;
    
        return (cornerDistance_sq <= (circleRadius^2));
    }

    static collisionSphereAndBox(sphere, box){
        //check if is inside 2d space x and z axis
        //after, we do the same thing but for the x and y axis
        if(this.circleInsideSquare(
            new THREE.Vector2(sphere.position.x, sphere.position.z),
            sphere.radius,
            new THREE.Vector2(box.position.x, box.position.z),
            new THREE.Vector2(box.size.x, box.size.z)
        ) && (this.circleInsideSquare(
                new THREE.Vector2(sphere.position.x, sphere.position.y),
                sphere.radius,
                new THREE.Vector2(box.position.x, box.position.y),
                new THREE.Vector2(box.size.x, box.size.y)
            ))){
            return true;
        }
        return false;
    }

    static randomPointsOnSphere(radius){
        const phi = Math.random() * 2 * Math.PI;
        const theta = Math.random() * Math.PI;
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);
        return new THREE.Vector3(x, y, z);
    }

    static getGravityForce2Particles(particleA, particleB){
        let distance = particleA.position.distanceTo(particleB.position);


        let tVector = new THREE.Vector3(
          (particleA.position.x - particleB.position.x),
          (particleA.position.y - particleB.position.y),
          (particleA.position.z - particleB.position.z),
        ).normalize();



        let forceX = -particleA.mass * particleB.mass * tVector.x / Math.pow(Math.pow(distance, 2) + 10, 3/2);
        let forceY = -particleA.mass * particleB.mass * tVector.y / Math.pow(Math.pow(distance, 2) + 10, 3/2);
        let forceZ = -particleA.mass * particleB.mass * tVector.z / Math.pow(Math.pow(distance, 2) + 10, 3/2);

        if(isNaN(forceX)){
            return new THREE.Vector3(0,0,0);
        }

        return new THREE.Vector3(forceX, forceY, forceZ);
    }

    static applyForceToPoint(particle, pointsPos, pointMass){
        let distance = particle.position.distanceTo(pointsPos);


        let tVector = new THREE.Vector3(
            (particle.position.x - pointsPos.x),
            (particle.position.y - pointsPos.y),
            (particle.position.z - pointsPos.z),
        ).normalize();


        let forceX = -1 * particle.mass * pointMass * tVector.x / Math.pow(Math.pow(distance, 2) + 2, 3/2);
        let forceY = -1 * particle.mass * pointMass * tVector.y / Math.pow(Math.pow(distance, 2) + 2, 3/2);
        let forceZ = -1 * particle.mass * pointMass * tVector.z / Math.pow(Math.pow(distance, 2) + 2, 3/2);

        if(isNaN(forceX)){
            particle.forceVector.add(new THREE.Vector3(0,0,0));
        }

        particle.forceVector.add(new THREE.Vector3(forceX, forceY, forceZ));
    }


}
