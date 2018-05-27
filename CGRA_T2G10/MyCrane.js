let STATE_D = 'D';
let STATE_R = 'R';

let BOT_ARM_R = 0.3;
let BOT_ARM_HEIGHT = 7.0;

let TOP_ARM_R = 0.3;
let TOP_ARM_HEIGHT = 4.0;

let CONNECTION_THICKNESS = BOT_ARM_R*2.0;
let CONNECTION_R = 0.8;

let TIP_R = 0.6;

let CABLE_R = 0.1;
let CABLE_LEN = 2.5;

let MAGNET_HEIGHT = 0.5;

/**
 * MyCrane
 * @constructor
 */
class MyCrane extends CGFobject
{
    constructor(scene) 
    {
        super(scene);

        this.lastTime = null;
        this.finishedSwitch = true;

        this.angle_bot_updown = new Animation(Math.PI/3, Math.PI/8, 2.0);
        this.angle_top_updown = new Animation(Math.PI/3, Math.PI/2, 2.0);
        this.angle_leftright = new Animation(0.0, Math.PI, 2.0);

        this.cyl = new MyCylinder(scene,20,10);
        this.circle = new MyCircle(scene,20);
        this.sphere = new MyGlobe(scene);

        this.rust = new CGFappearance(this.scene);
        this.rust.loadTexture("../resources/images/rust.jpg");

        this.darkMetal = new CGFappearance(this.scene);
        this.darkMetal.loadTexture("../resources/images/dark_metal.jpg");
    }

    display() 
    {
        this.rust.apply();

        this.scene.pushMatrix();

          // base
          this.scene.pushMatrix();
            this.scene.scale(1.0, 0.3, 1.0);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.circle.display();
            this.cyl.display();
          this.scene.popMatrix();

          // braço bot
          //this.scene.translate(0.0, 0.3, 0.0);
          this.scene.rotate(this.angle_leftright.getVal(),0,1,0);
          this.scene.rotate(-Math.PI/2 + this.angle_bot_updown.getVal(),1,0,0);

          this.scene.pushMatrix();
            this.scene.scale(BOT_ARM_R, BOT_ARM_R, BOT_ARM_HEIGHT);
            this.cyl.display();
          this.scene.popMatrix();

          this.scene.translate(0,0,BOT_ARM_HEIGHT);
          
          // conecção
          this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2,0,1,0);
            this.scene.scale(CONNECTION_R, CONNECTION_R, CONNECTION_THICKNESS);
            this.scene.pushMatrix();
              this.scene.translate(0,0,-0.5);
              this.cyl.display();
              this.circle.display();
            this.scene.popMatrix();

            this.scene.rotate(-Math.PI,0,1,0);
            this.scene.translate(0,0,-0.5);
            this.circle.display();
          this.scene.popMatrix();

          // braço top
          this.scene.rotate(this.angle_top_updown.getVal(),1,0,0);

          this.scene.pushMatrix();
            this.scene.scale(TOP_ARM_R, TOP_ARM_R, TOP_ARM_HEIGHT);
            this.cyl.display();
          this.scene.popMatrix();

          this.scene.translate(0,0,TOP_ARM_HEIGHT);
          
          this.scene.pushMatrix();
            this.scene.scale(TIP_R,TIP_R,TIP_R,)
            this.sphere.display();
          this.scene.popMatrix();

          this.darkMetal.apply();

          this.scene.rotate(Math.PI/2,1,0,0);
          this.scene.rotate(+Math.PI/2 - this.angle_bot_updown.getVal(),1,0,0);
          this.scene.rotate(-this.angle_top_updown.getVal(),1,0,0);
          this.scene.pushMatrix();
            this.scene.scale(CABLE_R,CABLE_R,CABLE_LEN);
            //this.scene.translate(0,0,-0.5);
            this.cyl.display();
          this.scene.popMatrix();

          this.scene.translate(0,0,CABLE_LEN);

          this.scene.pushMatrix();
            this.scene.rotate(Math.PI,0,1,0);
            this.scene.translate(0,0,-1.0);
            this.circle.display();
          this.scene.popMatrix();

          this.scene.pushMatrix();
            this.scene.translate(0,0,-1.0+MAGNET_HEIGHT);
            this.circle.display();
          this.scene.popMatrix();

          this.scene.pushMatrix();
            //this.scene.translate(0,0,-0.3-0.5);
            this.scene.scale(1.0,1.0,MAGNET_HEIGHT);
            this.cyl.display();
          this.scene.popMatrix();

        this.scene.popMatrix();
    }

    update(currTime) {
        if (this.lastTime == null) {
            this.lastTime = currTime;
        }
        let delta = currTime - this.lastTime;
        this.lastTime = currTime;
        let dt = delta/1000.0;

        this.angle_bot_updown.update(dt);
        this.angle_top_updown.update(dt);
        this.angle_leftright.update(dt);

        this.getMagnetPosition();
    }

    switchState() {
        this.angle_bot_updown.switchState();
        this.angle_top_updown.switchState();
        this.angle_leftright.switchState();
    }

    grabVehicle() {
    }

    dropVehicle() {
    }

    getMagnetPosition() {
        let a1 = this.angle_bot_updown.getVal();
        let z1 = BOT_ARM_HEIGHT*Math.cos(a1);
        let r1 = BOT_ARM_HEIGHT*Math.cos(a1);
        let a2 = this.angle_leftright.getVal() - Math.PI/2;
        let x1 = r1*Math.cos(a1);
        let y1 = r1*Math.sin(a1);

        let a3 = a1 + this.angle_top_updown.getVal();
        let z2 = TOP_ARM_HEIGHT*Math.cos(a3);
        let r2 = TOP_ARM_HEIGHT*Math.sin(a3);
        let x2 = r2*Math.cos(a3);
        let y2 = r2*Math.sin(a3);
        
        let v = [x1+x2, y1+y2, z1+z2];
        console.log(x1);
    }
}

class Animation {
    constructor(xi,xf,duration) {
        this.xi = xi;
        this.xf = xf;
        this.duration = duration;
        this.m = (this.xf - this.xi)/this.duration;;
        this.f0 = this.xi;
        this.time = 0.0;
        this.increasing = false;

        this.stopped = true;
    }

    f() {
        return this.f0 + this.m*this.time;
    }

    update(dt) {
        if (this.stopped) {
            return;
        }

        this.time += (this.increasing ? 1.0 : -1.0) * dt;

        if (!this.stopped) {
            if (this.increasing && this.time >= this.duration) {
                this.time = this.duration;
                this.stopped = true;
            } else if (!this.increasing && this.time <= 0.0) {
                this.time = 0.0;
                this.stopped = true;
            }
        }
    }

    getVal() {
        return this.f();
    }

    switchState() {
        this.stopped = false;
        this.increasing = !this.increasing;
    }
}
