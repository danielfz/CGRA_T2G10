var degToRad = Math.PI / 180.0;

let UPDATE_PERIOD_MS = 100;

let simTimeMs = 4*1000;
let useSimTimeLimit = true;

class LightingScene extends CGFscene 
{
	constructor()
	{
		super();
	};

	init(application) 
	{
		super.init(application);

		this.initCameras();

		this.initLights();

        this.enableTextures(true);

		this.gl.clearColor(0.529, 0.807, 0.921, 1.0);
		this.gl.clearDepth(100.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);

		this.axis = new CGFaxis(this);
		
		this.Eixos=true;
		this.Velocidade=0;
		this.Luz1=true;
		this.Luz2=true;
		this.Luz3=true;
		this.Luz4=true;
		
		//example for nrDivs = 8 -> grid of 9x9 vertices
		this.altimetry= [[ 4.5 , 5.0 , 4.0, 6.0, 4.5, 4.4, 4.3, 5.3, 6.0 ],
						[ 5.0 , 1.3 , 1.2, 1.0, 1.5, 1.4, 1.3, 1.3, 4.0 ],
						[ 5.0 , 1.2 , 0.0, 0.0, 0.0, 0.0, 0.0, 1.2, 4.0 ],
						[ 5.0 , 1.3 , 0.0, 0.0, 0.0, 0.0, 0.0, 1.6, 4.5 ],
						[ 6.5 , 1.5 , 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 4.8 ],
						[ 7.0 , 1.6 , 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 4.0 ],
						[ 6.6 , 1.7 , 0.0, 0.0, 0.0, 0.0, 0.0, 1.3, 4.0 ],
						[ 6.0 , 1.3 , 1.3, 1.5, 1.5, 1.2, 1.0, 1.0, 4.0 ],
						[ 5.5 , 5.0 , 4.0, 4.0, 4.5, 4.4, 4.3, 4.3, 5.5 ]
						];
		

		// Scene elements
		
        this.terrain = new MyTerrain(this, 8, this.altimetry, 1, 0, 1, 0);
		
        this.vehicle = new MyVehicle(this);
        this.vehicle.setPosition(0.0, 0.0, 4.0);
        //this.vehicle.setVelocity(2.1, 0.0, 0.0);
        /*
         *      0---1
         *     /|  /|
         *    2---3 |
         *    | | | |
         *    | 4-|-5
         *    |/  |/
         *    6---7   
         */
        this.obj = new MyBlock(this,
            0.0,   1.0,   0.0,
            1.0,   0.2,   0.0,
            1.0,   0.3,   0.0, 
            1.0,   0.2,   1.0,
            0.0,   0.0,   0.0,
            1.0,   0.0,   0.0,
            1.0,   0.0,   1.0
        );

        this.crane = new MyCrane(this);

		// Materials
		this.materialDefault = new CGFappearance(this);
		this.materialDefault.apply();
		
		this.materialA = new CGFappearance(this);
		this.materialA.setAmbient(0.3,0.3,0.3,1);
		this.materialA.setDiffuse(0.6,0.6,0.6,1);
		//this.materialA.setSpecular(0.2,0.2,0.2,1);
		this.materialA.setSpecular(0.8,0.2,0.8,1);	
		this.materialA.setShininess(10);
		this.materialA.setShininess(120);

		this.materialB = new CGFappearance(this);
		this.materialB.setAmbient(0.3,0.3,0.3,1);
		this.materialB.setDiffuse(0.6,0.6,0.6,1);
		this.materialB.setSpecular(0.8,0.8,0.8,1);	
		this.materialB.setShininess(120);

		this.materialSteel = new CGFappearance(this);
		this.materialSteel.setAmbient(0.5,0.5,0.5,1);
		this.materialSteel.setDiffuse(0.5,0.5,0.5,1);
		this.materialSteel.setSpecular(1.0,1.0,1.0,1);	
		this.materialSteel.setShininess(10);
		
        this.setUpdatePeriod(UPDATE_PERIOD_MS);
	};

	initCameras() 
	{
		this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
	};

    update(currTime) {
        //this.vehicle.setAcceleration(0.0, 0.0, -this.vehicle.getPosition()[2]);
        this.checkKeys();
        if (useSimTimeLimit) {
            simTimeMs -= 100;
        } else {
            simTimeMs = 1;
        }
        if (simTimeMs > 0) {
            this.vehicle.update(currTime);
        }

        this.crane.update();
    }

	initLights() 
	{
		//this.setGlobalAmbientLight(0.0,0.0,0.0, 0.0);
		this.setGlobalAmbientLight(0.5,0.5,0.5, 1.0);
		
		// Positions for four lights
		this.lights[0].setPosition(4, 6, 1, 1);
		this.lights[0].setVisible(true); // show marker on light position (different from enabled)
		
		this.lights[1].setPosition(10.5, 6.0, 1.0, 1.0);
		this.lights[1].setVisible(true); // show marker on light position (different from enabled)

		//this.lights[2].setPosition(10.5, 6.0, 5.0, 1.0);
		//this.lights[1].setVisible(true); // show marker on light position (different from enabled)
		//this.lights[3].setPosition(4, 6.0, 5.0, 1.0);
		//this.lights[1].setVisible(true); // show marker on light position (different from enabled)

		this.lights[0].setAmbient(0, 0, 0, 1);
		this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[0].setSpecular(1.0, 1.0, 0.0, 1.0);
		this.lights[0].enable();

		this.lights[1].setAmbient(0, 0, 0, 1);
		this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[1].enable();

		this.lights[2].setPosition(10.5, 6.0, 5.0, 1.0);
		this.lights[2].setVisible(true); // show marker on light position (different from enabled)
		this.lights[2].setAmbient(0, 0, 0, 1);
		this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[2].setSpecular(1.0, 1.0, 0.0, 1.0);
		this.lights[2].setConstantAttenuation(0.0);
		this.lights[2].setLinearAttenuation(1.0);
		this.lights[2].setQuadraticAttenuation(0.0);
		this.lights[2].enable();

		this.lights[3].setPosition(4, 6, 5, 1);
		this.lights[3].setVisible(true); // show marker on light position (different from enabled)
		this.lights[3].setAmbient(0, 0, 0, 1);
		this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[3].setSpecular(1.0, 1.0, 0.0, 1.0);
		this.lights[2].setConstantAttenuation(0.0);
		this.lights[2].setLinearAttenuation(0.0);
		this.lights[2].setQuadraticAttenuation(1.0);
		this.lights[3].enable();

	};

	updateLights() 
	{
		for (var i = 0; i < this.lights.length; i++) {
			if (!this.Luz1 && i == 0) continue;
			if (!this.Luz2 && i == 1) continue;
			if (!this.Luz3 && i == 2) continue;
			if (!this.Luz4 && i == 3) continue;
			this.lights[i].update();
		}
	}
	
	doSomething() { 
		console.log("Doing something..."); 
	};

	checkKeys() {
		if (this.gui.isKeyPressed("KeyW")) {
            console.log("Key: Forward");
            this.vehicle.forward();
		} else if (this.gui.isKeyPressed("KeyS")) {
            this.vehicle.reverse();
		} else if (this.gui.isKeyPressed("KeyR")) {
            this.vehicle.brakes();
		} else {
            this.vehicle.idle();
        }

		if (this.gui.isKeyPressed("KeyA")) {
            console.log("Key: Steer left");
            this.vehicle.beginSteerLeft();
		} else if (this.gui.isKeyPressed("KeyD")) {
            console.log("Key: Steer right");
            this.vehicle.beginSteerRight();
        } else {
            this.vehicle.stopSteer();
        }
	}
	
	display() 
	{
		// ---- BEGIN Background, camera and axis setup

		// Clear image and depth buffer everytime we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// Initialize Model-View matrix as identity (no transformation)
		this.updateProjectionMatrix();
		this.loadIdentity();

		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();

		// Update all lights used
		this.updateLights();

		// Draw axis
        if (this.Eixos) this.axis.display();

		this.materialDefault.apply();

		// ---- END Background, camera and axis setup

		// ---- BEGIN Scene drawing section

		
		this.pushMatrix();
			this.rotate(-Math.PI/2.0, 1.0, 0.0, 0.0);
			this.terrain.display();
		this.popMatrix();
		
		// Vehicle
		this.pushMatrix();
          this.vehicle.display();
		this.popMatrix();
        
		this.materialDefault.apply();

        this.obj.display();

        this.crane.display();

		// ---- END Scene drawing section
	};
};
