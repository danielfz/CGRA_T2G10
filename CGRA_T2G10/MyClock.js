var CLOCK_R = 0.7;
var CLOCK_THICKNESS = 0.2;

let HAND_T = 0.05;
let HOURS_HAND_L = 0.45;
let MINUTES_HAND_L = 0.7;
let SECONDS_HAND_L = 0.9;

let CLOCK_SLICES = 24;

let SECS_PER_MIN = 60;
let SECS_PER_HOUR = 60*60;


let CLOCK_SMOOTH_MODE = false;

/**
 * MyClock
 * @constructor
 */
class MyClock extends CGFobject
{
    constructor(scene) 
    {
        super(scene);

        this.cylinder = new MyCylinder(this.scene,CLOCK_SLICES,1);
        this.face = new MyCircle(this.scene,CLOCK_SLICES);

        this.clockFaceAppearance = new CGFappearance(this.scene);
        this.clockFaceAppearance.loadTexture("../resources/images/clock.png");

        this.redAppearance = new CGFappearance(this.scene);
        this.redAppearance.setAmbient(1.0, 0.0, 0.0, 1);
		this.redAppearance.setDiffuse(1.0, 0.0, 0.0, 1);
		this.redAppearance.setSpecular(1.0, 0.0, 0.0, 1);	

        this.blackAppearance = new CGFappearance(this.scene);
        this.blackAppearance.setAmbient(1.0, 1.0, 1.0, 1);
		this.blackAppearance.setDiffuse(1.0, 1.0, 1.0, 1);
		this.blackAppearance.setSpecular(1.0, 1.0, 1.0, 1);	


        this.hand = new MyUnitCubeQuad(this.scene);

        this.startSysTime = 0;
        this.dt_ms = 0;

        this.paused_dt_ms = 0;
        this.paused = false;

        this.setTimeCallback = null;
    };

    displayHand(theta,L,t) {
        this.scene.pushMatrix();
        this.scene.translate(0.0, 0.0, CLOCK_THICKNESS);
        this.scene.rotate(theta, 0.0, 0.0, 1.0);
        this.scene.scale(L*CLOCK_R, t, t);
        this.scene.translate(0.5, 0.5, 0.5);
        this.hand.display();
        this.scene.popMatrix();
    }

    display() 
    {
        this.scene.pushMatrix();
        this.redAppearance.apply();
        this.displayHand(this.getHoursAngle(), HOURS_HAND_L,   HAND_T);
        this.displayHand(this.getMinutesAngle(), MINUTES_HAND_L, HAND_T);
        this.displayHand(this.getSecondsAngle(), SECONDS_HAND_L, HAND_T);

        //this.scene.materialDefault.apply();
        this.blackAppearance.apply();
        this.scene.scale(CLOCK_R, CLOCK_R, CLOCK_THICKNESS);
        this.cylinder.display();

        this.clockFaceAppearance.apply();
        this.face.display();
        this.scene.popMatrix();
    };

    update(currTime) {
        if (this.paused) {
            currTime = this.paused_dt_ms;
        }
        this.dt_ms = currTime - this.startSysTime;
        if (this.setTimeCallback != null) {
            this.setTimeCallback();
            this.setTimeCallback = null;
        }
    }

    castIfNeeded(d) { return CLOCK_SMOOTH_MODE ? d : parseInt(d,10); }
    getSeconds() { return this.castIfNeeded((this.dt_ms/1000.0) % 60); }
    getMinutes() { return this.castIfNeeded(((this.dt_ms/1000.0) / SECS_PER_MIN) % 60); }
    getHours()   { return this.castIfNeeded(((this.dt_ms/1000.0) / SECS_PER_HOUR) % 12); }

    getSecondsAngle() { return this.getSeconds() * (-1.0*(2.0*Math.PI)/60) + Math.PI/2; }
    getMinutesAngle() { return this.getMinutes() * (-1.0*(2.0*Math.PI)/60) + Math.PI/2; } 
    getHoursAngle()   { return this.getHours()   * (-1.0*(2.0*Math.PI)/12) + Math.PI/2; }

    setTime(hour,minute,second) {
        this.setTimeCallback = function() {
            this.startSysTime = this.dt_ms - ((hour*60 + minute)*60 + second)*1000;
        };
    }

    printTime() {
        console.log(this.getHours() + "h" + this.getMinutes() + "m" + this.getSeconds());
    }

    setPaused(p) {
        if (p) {
            this.paused_dt_ms = this.dt_ms;
            this.paused = true;
        } else {
            this.paused = false;
        }
    }
};

