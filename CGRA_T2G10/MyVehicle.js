let DEBUG_MSGS = false;

let PI = Math.PI;
let TWOPI = Math.PI*2.0;
let HALFPI = Math.PI/2.0;

let VEHICLE_MASS = 1800;
let VEHICLE_ROTATIONAL_INERTIA = 1800;
let ENGINE_FORWARD_FORCE = 5000;
let ENGINE_REVERSE_FORCE = 2000;

let BODY_FLOOR_DIST = 0.2;
let BODY1_HEIGHT = 0.6;
let BODY1_WIDTH = 2.0;
let BODY1_LENGTH = 4.5;

let BODY2_HEIGHT = BODY1_HEIGHT/2.0 + 0.2;
let BODY2_WIDTH = BODY1_WIDTH;
let BODY2_LENGTH = BODY1_LENGTH/3.0;

let WHEEL_RADIUS = 0.4;
let WHEEL_WIDTH = 0.3;
let WHEEL_MAX_STEER_ANGLE = (PI/2.0)*0.6;
let WHEEL_STEER_SPEED = 1.4;
let WHEEL_STEER_RESTORE = 0.30;
let WHEEL_GRIP = 1500;
let WHEEL_MAX_GRIP_FORCE = 3000;

let ENGINE_IDLE = 0;
let ENGINE_FORWARD = 1;
let ENGINE_REVERSE = -1;
let ENGINE_BREAK = 3;

function addVector(s, t) { return [s[0]+t[0], s[1]+t[1], s[2]+t[2]]; }

function subVector(s, t) { return [s[0]-t[0], s[1]-t[1], s[2]-t[2]]; }

function intProduct(s, t) { return s[0]*t[0] + s[1]*t[1] + s[2]*t[2]; }

function multVector(v,k) { return [v[0]*k, v[1]*k, v[2]*k]; }

function modVector(v) { return Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]); }

function crossProd(s, t) { return [s[1]*t[2]-s[2]*t[1], s[2]*t[0]-s[0]*t[2], s[0]*t[1]-s[1]*t[0]]; }

function rotVectorInY(v,alpha) { 
    let c = Math.cos(alpha);
    let s = Math.sin(alpha);
    return [v[0]*c + v[2]*s, v[1], v[2]*c - v[0]*s];
}

function log (msg) {
    if (DEBUG_MSGS) {
        console.log(msg);
    }
}

class MyWheel extends CGFobject {
    constructor(scene,vehicle,dx,dy,dz,powered) {
        super(scene);
        this.dx = dx;
        this.dy = dy;
        this.dz = dz;
        this.vehicle = vehicle;
        this.cylinder = new MyCylinder(this.scene,20,10);
        this.circle1 = new MyCircle(this.scene,20,10);
        this.r = WHEEL_RADIUS;
        this.width = WHEEL_WIDTH;
        this.rotAngle = 0.0;
        this.steerAngle = 0.0;
        this.steerRate = 0.0;
        this.isSteering = false;
        this.flipSign = 1.0;
        this.isPowered = powered;
        this.totalVelocity = [0.0, 0.0, 0.0];

        this.circleAppearance = new CGFappearance(this.scene);
        this.circleAppearance.loadTexture("../resources/images/roda.png");

        this.tyreAppearance = new CGFappearance(this.scene);
        this.tyreAppearance.loadTexture("../resources/images/pneu.png");
    }

    flipHorizontal() {
        this.flipSign *= -1.0;
    }

    beginSteerRight() {
        this.steerRate = -WHEEL_STEER_SPEED;
        this.isSteering = true;
    }

    beginSteerLeft() {
        this.steerRate = WHEEL_STEER_SPEED;
        this.isSteering = true;
    }

    stopSteer() {
        if (!this.isSteering) {
            return;
        }
        let sign = this.steerRate > 0 ? -1.0 : 1.0;
        this.steerRate = WHEEL_STEER_RESTORE*sign;
        this.isSteering = false;
    }

    display() {
        this.scene.pushMatrix();
            this.scene.translate(this.dx,this.dy,this.dz);
            this.scene.rotate(this.flipSign*HALFPI + this.steerAngle, 0.0, 1.0, 0.0);
            this.scene.translate(0.0, 0.0, -this.width/2.0);
            this.scene.scale(this.r,this.r,this.width);
            log("rot a " + this.rotAngle);
            log("rot sign " + this.flipSign);
            this.scene.rotate(this.flipSign*this.rotAngle, 0.0, 0.0, 1.0);

            this.circleAppearance.apply();
            this.circle1.display();

            this.tyreAppearance.apply();
            this.cylinder.display();
        this.scene.popMatrix();
    }

    getFrontVector() {
        let alpha = this.steerAngle + this.vehicle.getAngle();
        return [Math.sin(alpha), 0.0, Math.cos(alpha)];
    }

    updateSteer(dt) {
        this.steerAngle += this.steerRate*dt;
        if (this.steerAngle > WHEEL_MAX_STEER_ANGLE) {
            this.steerAngle = WHEEL_MAX_STEER_ANGLE;
        } else if (this.steerAngle < -WHEEL_MAX_STEER_ANGLE) {
            this.steerAngle = -WHEEL_MAX_STEER_ANGLE;
        }
        if (!this.isSteering) {
            this.steerRate = -1.0*this.steerAngle*WHEEL_STEER_RESTORE;
            if (this.steerAngle < 0.05 && this.steerAngle > -0.05) {
                this.steerAngle = 0.0;
                this.steerRate = 0.0;
            }
        }
    }

    updateRotation(dt) {
        let rotSpeed = intProduct(this.totalVelocity,this.getFrontVector()) / this.r;
        log("rot speed: " + rotSpeed);
        log("dt: " + dt);
        this.rotAngle += rotSpeed*dt;
        log("rot angle: " + this.rotAngle);
        if (this.rotAngle > TWOPI) {
            this.rotAngle -= TWOPI;
        }
        if (this.rotAngle < -TWOPI) {
            this.rotAngle += TWOPI;
        }
    }

    getRelativePosition() {
        return rotVectorInY([this.dx, this.dy, this.dz],this.vehicle.getAngle());
    }

    updateTotalVelocity() {
        this.totalVelocity = this.vehicle.getVelocityOfPart(this.getRelativePosition());
    }

    computeForce(engine) {
        log("computeForce ----------");

        let F = [0.0, 0.0, 0.0];

        log("steer angle: " + this.steerAngle);
        log("front vector: " + this.getFrontVector());

        if (engine == ENGINE_BREAK) {
            F = addVector(F,multVector(this.totalVelocity,-WHEEL_GRIP));
        } else {
            let colinearVelocity = multVector(this.getFrontVector(),intProduct(this.totalVelocity,this.getFrontVector()));
            let perpendicularVelocity = subVector(this.totalVelocity,colinearVelocity);
            F = addVector(F,multVector(perpendicularVelocity,-WHEEL_GRIP));

            log("perp vel: " + perpendicularVelocity);
        }

        for (let i = 0; i < 3; i++) {
            if (F[i] > WHEEL_MAX_GRIP_FORCE) {
                F[i] = WHEEL_MAX_GRIP_FORCE;
            } else if (F[i] < -WHEEL_MAX_GRIP_FORCE) {
                F[i] = -WHEEL_MAX_GRIP_FORCE;
            }
        }

        log("wheel grip force: " + F);
        log("wheel original position: " + [this.dx, this.dy, this.dz]);
        log("wheel rel position: " + this.getRelativePosition());

        if (this.isPowered) {
            if (engine == ENGINE_FORWARD) {
                F = addVector(F,multVector(this.getFrontVector(),ENGINE_FORWARD_FORCE/2.0));
            } else if (engine == ENGINE_REVERSE) {
                F = addVector(F,multVector(this.getFrontVector(),-ENGINE_REVERSE_FORCE/2.0));
            }
        }

        log("wheel total force: " + F);
        return F;
    }
}

/**
 * MyVehicle
 * @constructor
 */
class MyVehicle extends CGFobject
{
    constructor(scene) 
    {
        super(scene);
        this.p = [0.0, 0.0, 0.0];
        this.v = [0.0, 0.0, 0.0];
        this.a = [0.0, 0.0, 0.0];
        this.angle = Math.PI/2;
        this.lastTime = null;
        this.mass = VEHICLE_MASS;
        this.rotInercia = VEHICLE_ROTATIONAL_INERTIA;
        this.omega = 0.0;
        this.engine = 0;

        this.body1 = new MyUnitCubeQuad(this.scene);
        this.body2 = new MyUnitCubeQuad(this.scene);
        this.wheel_FR = new MyWheel(this.scene, this, -BODY1_WIDTH/2.0,  0.0,  BODY1_LENGTH/3.0, false);
        this.wheel_FL = new MyWheel(this.scene, this,  BODY1_WIDTH/2.0,  0.0,  BODY1_LENGTH/3.0, false);
        this.wheel_RR = new MyWheel(this.scene, this, -BODY1_WIDTH/2.0,  0.0, -BODY1_LENGTH/3.0, true);
        this.wheel_RL = new MyWheel(this.scene, this,  BODY1_WIDTH/2.0,  0.0, -BODY1_LENGTH/3.0, true);
        this.wheel_FR.flipHorizontal();
        this.wheel_RR.flipHorizontal();
    };

    display() 
    {
        this.scene.pushMatrix();
          this.scene.translate(this.p[0],this.p[1],this.p[2]);
          this.scene.rotate(this.angle, 0, 1, 0);

          this.scene.pushMatrix();
            this.scene.translate(0.0, BODY_FLOOR_DIST, 0.0);

            this.scene.pushMatrix();
              this.scene.translate(0.0, BODY1_HEIGHT/2.0, 0.0);
              this.scene.scale(BODY1_WIDTH, BODY1_HEIGHT, BODY1_LENGTH);
              this.body1.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
              this.scene.translate(0.0, BODY1_HEIGHT + BODY2_HEIGHT/2.0, 0.0);
              this.scene.scale(BODY2_WIDTH, BODY2_HEIGHT, BODY2_LENGTH);
              this.body2.display();
            this.scene.popMatrix();
          this.scene.popMatrix();

          this.wheel_FL.display();
          this.wheel_FR.display();
          this.wheel_RL.display();
          this.wheel_RR.display();
        this.scene.popMatrix();
    };

    beginSteerRight() {
        this.wheel_FL.beginSteerRight();
        this.wheel_FR.beginSteerRight();
    }

    beginSteerLeft() {
        this.wheel_FL.beginSteerLeft();
        this.wheel_FR.beginSteerLeft();
    }

    stopSteer() {
        this.wheel_FL.stopSteer();
        this.wheel_FR.stopSteer();
    }

    update(currTime) {
        log("update ###################");
        if (this.lastTime == null) {
            this.lastTime = currTime;
        }
        let delta = currTime - this.lastTime;
        this.lastTime = currTime;
        let dt = delta/1000.0;

        this.wheel_FL.updateTotalVelocity();
        this.wheel_FR.updateTotalVelocity();
        this.wheel_RL.updateTotalVelocity();
        this.wheel_RR.updateTotalVelocity();

        this.wheel_FL.updateSteer(dt);
        this.wheel_FR.updateSteer(dt);
        this.wheel_RL.updateSteer(dt);
        this.wheel_RR.updateSteer(dt);

        let F_FL = this.wheel_FL.computeForce(this.engine);
        let F_FR = this.wheel_FR.computeForce(this.engine);
        let F_RL = this.wheel_RL.computeForce(this.engine);
        let F_RR = this.wheel_RR.computeForce(this.engine);

        let F = [0.0, 0.0, 0.0];
        F = addVector(F,F_FL);
        F = addVector(F,F_FR);
        F = addVector(F,F_RL);
        F = addVector(F,F_RR);

        let tau = [0.0, 0.0, 0.0];
        tau = addVector(tau, crossProd(this.wheel_FL.getRelativePosition(), F_FL));
        tau = addVector(tau, crossProd(this.wheel_FR.getRelativePosition(), F_FR));
        tau = addVector(tau, crossProd(this.wheel_RL.getRelativePosition(), F_RL));
        tau = addVector(tau, crossProd(this.wheel_RR.getRelativePosition(), F_RR));

        this.omega += (tau[1] / this.rotInercia)*dt;
        this.angle += this.omega*dt;
        if (this.angle > TWOPI) {
            this.angle -= TWOPI;
        } else if (this.angle < -TWOPI) {
            this.angle += TWOPI;
        }
        log("angle: " + this.angle);

        this.a = multVector(F,1/this.mass);
        this.v = addVector(this.v, multVector(this.a,dt));
        this.p = addVector(this.p, multVector(this.v,dt));
        log("tau: " + tau);
        log("force: " + F);
        log("end of update ###################");

        log(this.v);

        this.wheel_FL.updateRotation(dt);
        this.wheel_FR.updateRotation(dt);
        this.wheel_RL.updateRotation(dt);
        this.wheel_RR.updateRotation(dt);
    }

    getFrontVector() { return [Math.sin(this.angle), 0.0, Math.cos(this.angle)]; }

    getPosition(x,y,z) { return this.p; }
    setPosition(x,y,z) { this.p = [x, y, z]; }

    getVelocity() { return this.v; }
    setVelocity(vx,vy,vz) { this.v = [vx, vy, vz]; }

    getVelocityValue() { return modVector(this.v); }

    // TODO
    getVelocityOfPart(position) {
        return addVector(this.v,crossProd([0.0, this.omega, 0.0],position));
    }

    getAcceleration() { return this.a; }
    setAcceleration(ax,ay,az) { this.a = [ax, ay, az]; }

    getAngle(angle) { return this.angle; }
    setAngle(angle) { this.angle = angle; }

    forward() { this.engine = ENGINE_FORWARD; }
    reverse() { this.engine = ENGINE_REVERSE; }
    idle()    { this.engine = ENGINE_IDLE; }
    brakes()  { this.engine = ENGINE_BREAK; }
};

