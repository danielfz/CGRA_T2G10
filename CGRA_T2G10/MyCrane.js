let STATE_D = 'D';
let STATE_R = 'R';

/**
 * MyCrane
 * @constructor
 */
class MyCrane extends CGFobject
{
    constructor(scene) 
    {
        super(scene);

        this.topArm = new MyTopArm(scene);
        this.botArm = new MyBotArm(scene);
        this.lastTime = null;
        this.state = STATE_D;
        this.finishedSwitch = true;
    }

    display() 
    {
        //this.topArm.display();
        this.botArm.display();
    }

    update(currTime) {
        if (this.lastTime == null) {
            this.lastTime = currTime;
        }
        let delta = currTime - this.lastTime;
        this.lastTime = currTime;
        let dt = delta/1000.0;

        this.topArm.update(dt);
        this.botArm.update(dt);
    }

    switchState() {
        this.botArm.switchState();
    }

    grabVehicle() {
    }

    dropVehicle() {
    }

    getMagnetPosition() {
    }
}

class MyTopArm extends CGFobject {
    constructor(scene) 
    {
        super(scene);
        this.angle = new Animation(0.0, Math.PI/3, 2.0);

        this.base = new MyCylinder(scene,20,10);
        this.arm = new MyCylinder(scene,20,10);
        this.cable = new MyCylinder(scene,20,10);
        this.magnet = new MyCylinder(scene,20,10);
    }

    display() {
    }

    update(dt) {
        this.angle.update(dt);
    }
}

class MyBotArm extends CGFobject {
    constructor(scene) 
    {
        super(scene);

        this.angle_updown = new Animation(0.0, Math.PI/2, 2.0);
        this.angle_leftright = new Animation(0.0, Math.PI/2, 2.0);;

        this.cyl = new MyCylinder(scene,20,10);
        this.circle = new MyCircle(scene,20);
    }

    display() {
        this.scene.pushMatrix();
          this.scene.pushMatrix();
              this.scene.scale(1.0, 0.3, 1.0);
              this.scene.rotate(-Math.PI/2,1,0,0);
              this.cyl.display();
          this.scene.popMatrix();
          this.scene.pushMatrix();
              this.scene.scale(0.5, 0.5, 4.0);
              this.scene.rotate(-Math.PI/2,1,0,0);
              this.cyl.display();
          this.scene.popMatrix();
        this.scene.popMatrix();
    }

    update(dt) {
        this.angle_updown.update(dt);
        this.angle_leftright.update(dt);
    }

    switchState() {
        this.angle_updown.switchState();
        this.angle_leftright.switchState();
    }
}

class Animation {
    constructor(xi,xf,duration) {
        this.xi = xi;
        this.xf = xf;
        this.x = 0.0;
        this.t = 0.0;
        this.finished = true;
        this.increasing = true;
    }

    update(dt) {
        if (this.finished) {
            return;
        }

        let dx = dt/this.duration;
        this.x += (this.increasing ? 1.0 : -1.0) * dx;

        if (this.increasing && this.x > this.xf) {
            this.x = this.xf;
            this.finished = true;
            this.increasing = !this.increasing;
        } else if (this.increasing && this.x < this.xi) {
            this.x = this.xi;
            this.finished = true;
            this.increasing = !this.increasing;
        }
    }

    getVal() {
        return this.x;
    }

    switchState() {
        this.finished = false;
    }
}
