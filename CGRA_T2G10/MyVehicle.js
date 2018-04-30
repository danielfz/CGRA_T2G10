

class MyWheel extends CGFobject {
    constructor(scene,dx,dy,dz) {
        super(scene);
        this.cylinder = new MyCylinder(this.scene);
        this.dx = dx;
        this.dy = dy;
        this.dz = dz;
    }

    display() {
        this.scene.pushMatrix();
            this.scene.translate(this.dx,this.dy,this.dz);
            this.cylinder.display();
        this.scene.popMatrix();
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
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
        this.vx = 0.0;
        this.vy = 0.0;
        this.vz = 0.0;
        this.ax = 0.0;
        this.ay = 0.0;
        this.az = 0.0;
        this.lastTime = null;

        this.body = new MyUnitCubeQuad(this.scene);
        this.wheel_frontleft  = new MyWheel(this.scene, -0.4,  0.0,  0.2);
        this.wheel_frontright = new MyWheel(this.scene,  0.4,  0.0,  0.2);
        this.wheel_rearleft   = new MyWheel(this.scene, -0.4,  0.0, -0.2);
        this.wheel_rearright  = new MyWheel(this.scene,  0.4,  0.0, -0.2);
    };

    display() 
    {
        this.scene.pushMatrix();
        this.scene.translate(this.x,this.y,this.z);
        this.body.display();
        this.wheel_frontleft.display();
        this.wheel_frontright.display();
        this.wheel_rearleft.display();
        this.wheel_rearright.display();
        this.scene.popMatrix();
    };

    update(currTime) {
        if (this.lastTime == null) {
            this.lastTime = currTime;
        }
        let delta = currTime - this.lastTime;
        this.lastTime = currTime;

        let dt = delta/1000.0;

        this.vx += this.ax*dt;
        this.vy += this.ay*dt;
        this.vz += this.az*dt;

        this.x += this.vx*dt;
        this.y += this.vy*dt;
        this.z += this.vz*dt;
    }

    setPosition(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    setVelocity(vx,vy,vz) {
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
    }

    setAcceleration(ax,ay,az) {
        this.ax = ax;
        this.ay = ay;
        this.az = az;
    }
};

