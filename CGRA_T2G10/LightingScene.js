var degToRad = Math.PI / 180.0;

var BOARD_WIDTH = 6.0;
var BOARD_HEIGHT = 4.0;

var BOARD_A_DIVISIONS = 30;
var BOARD_B_DIVISIONS = 100;

var ROOM_HEIGHT = 8.0;
var ROOM_WIDTH = 15.0;

let CLOCK_UPDATE_PERIOD_MS = 100;

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

		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
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

		// Scene elements
		this.table = new MyTable(this);
		this.planeWall = new Plane(this);
		this.quadWall = new MyQuad(this, -0.7, 1.7, -0.3, 1.3);

		this.floor = new MyQuad(this,0.0, 10.0, 0.0, 12.0);
		
		this.boardA = new Plane(this, BOARD_A_DIVISIONS,-0.5,1.5,0.0,1.0);
		this.boardB = new Plane(this, BOARD_B_DIVISIONS);

        this.clock = new MyClock(this,6,1);

        this.globe = new MyGlobe(this,12,16);

		// Materials
		this.materialDefault = new CGFappearance(this);
		
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

		this.materialWall = new CGFappearance(this);
		this.materialWall.setAmbient(0.3,0.3,0.3,1);
		this.materialWall.setDiffuse(0.6,0.6,0.6,1);
		this.materialWall.setSpecular(0.8,0.8,0.8,1);	
		this.materialWall.setShininess(120);

		this.materialWood = new CGFappearance(this);
		this.materialWood.setAmbient(0.5,0.3,0.2,1);
		this.materialWood.setDiffuse(0.5,0.3,0.2,1);
		this.materialWood.setSpecular(0.1,0.1,0.1,1);	
		this.materialWood.setShininess(10);

		this.materialSteel = new CGFappearance(this);
		this.materialSteel.setAmbient(0.5,0.5,0.5,1);
		this.materialSteel.setDiffuse(0.5,0.5,0.5,1);
		this.materialSteel.setSpecular(1.0,1.0,1.0,1);	
		this.materialSteel.setShininess(10);
		
		this.materialFloor = new CGFappearance(this);
		this.materialFloor.setAmbient(0.3,0.3,0.3,1);
		this.materialFloor.setDiffuse(0.6,0.6,0.6,1);
		this.materialFloor.setSpecular(0.8,0.8,0.8,1);	
		this.materialFloor.setShininess(120);
        this.materialFloor.loadTexture("../resources/images/floor.png");
        this.materialFloor.setTextureWrap("REPEAT");

        this.windowAppearance = new CGFappearance(this);
        this.windowAppearance.loadTexture("../resources/images/window.png");
        this.windowAppearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        this.slidesAppearance = new CGFappearance(this);
        this.slidesAppearance.loadTexture("../resources/images/slides.png");
        this.slidesAppearance.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

        this.boardAppearance = new CGFappearance(this);
        this.boardAppearance.loadTexture("../resources/images/board.png");

        this.lampAppearance = new CGFappearance(this);
        this.lampAppearance.loadTexture("../resources/images/floor.png");

        this.setUpdatePeriod(CLOCK_UPDATE_PERIOD_MS);
	};

	initCameras() 
	{
		this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
	};

    update(currTime) {
        this.clock.update(currTime);
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
		for (var i = 0; i < this.lights.length; i++)
			this.lights[i].update();
	}
	
	doSomething() { 
		console.log("Doing something..."); 
	};

	checkKeys() {
		var text="Keys pressed: ";
		var keysPressed=false;
		if (this.gui.isKeyPressed("KeyW")) {
			text+=" W ";
			keysPressed=true;
		}
		if (this.gui.isKeyPressed("KeyS")) {
			text+=" S ";
			keysPressed=true;
		}
		if (keysPressed)
			console.log(text);
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
		this.axis.display();

		this.materialDefault.apply();

		// ---- END Background, camera and axis setup

		// ---- BEGIN Scene drawing section

		// Floor
        this.materialFloor.apply();
		this.pushMatrix();
			this.translate(ROOM_WIDTH/2, 0, ROOM_WIDTH/2);
			this.rotate(-90 * degToRad, 1, 0, 0);
			this.scale(ROOM_WIDTH, ROOM_WIDTH, 0.2);
			this.floor.display();
		this.popMatrix();

		// Left Wall
        this.windowAppearance.apply();
		this.pushMatrix();
			this.translate(0, 4, 7.5);
			this.rotate(90 * degToRad, 0, 1, 0);
			this.scale(ROOM_WIDTH, ROOM_HEIGHT, 0.2);
			this.quadWall.display();
		this.popMatrix();

		// Plane Wall
        this.materialWall.apply();
		this.pushMatrix();
			this.translate(7.5, 4, 0);
			this.scale(ROOM_WIDTH, ROOM_HEIGHT, 0.2);
			this.planeWall.display();
		this.popMatrix();

		// First Table
        //this.materialWood.apply();
		this.pushMatrix();
			this.translate(5, 0, 8);
			this.table.display();
		this.popMatrix();

		// Second Table
        //this.materialWood.apply();
		this.pushMatrix();
			this.translate(12, 0, 8);
			this.table.display();
		this.popMatrix();

		// Board A
        //this.materialA.apply();
        this.slidesAppearance.apply();
		this.pushMatrix();
			this.translate(4, 4.5, 0.2);
			this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);
			this.boardA.display();
		this.popMatrix();

		// Board B
        //this.materialB.apply();
        this.boardAppearance.apply();
		this.pushMatrix();
			this.translate(10.5, 4.5, 0.2);
			this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);
			this.boardB.display();
		this.popMatrix();

        // Clock
		this.pushMatrix();
			this.translate(ROOM_WIDTH/2, ROOM_HEIGHT-CLOCK_R, 0.0);
            this.clock.display();
		this.popMatrix();

        // Globe
		this.pushMatrix();
            this.translate(6.5, 4.6, 7.5);
            //this.rotate(-Math.PI/2.0, 1.0, 0.0, 0.0);
            this.globe.display();
		this.popMatrix();

		// ---- END Scene drawing section
	};
};
