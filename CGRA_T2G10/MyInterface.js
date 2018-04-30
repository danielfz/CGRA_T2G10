 
class MyInterface extends CGFinterface {


	/**
	 * MyInterface
	 * @constructor
	 */
 	constructor () {
 		super();
 	}
	
	/**
	 * init
	 * @param {CGFapplication} application
	 */
	init(application) {
		// call CGFinterface init
		super.init(application);

		// init GUI. For more information on the methods, check:
		//  http://workshop.chromeexperiments.com/examples/gui

		this.gui = new dat.GUI();

		// add a button:
		// the first parameter is the object that is being controlled (in this case the scene)
		// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
		// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); }; 

		this.gui.add(this.scene, 'doSomething');

		// add a group of controls (and open/expand by defult)

		var geral = this.gui.addFolder("Geral");
		var luzes = this.gui.addFolder("Luzes");
		geral.open();

		// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
		// e.g. this.option1=true; this.option2=false;

		geral.add(this.scene, 'Eixos');
		geral.add(this.scene, 'Velocidade', -5, 5).step(1);
		
		luzes.add(this.scene, 'Luz 1');
		luzes.add(this.scene, 'Luz 2');
		luzes.add(this.scene, 'Luz 3');
		luzes.add(this.scene, 'Luz 4');

		initKeys();
		
		return true;
	};

	/**
	 * processKeyboard
	 * @param event {Event}
	 */
	/*processKeyboard(event) {
		// call CGFinterface default code (omit if you want to override)
		super.processKeyboard(event);

		// Check key codes e.g. here: http://www.asciitable.com/
		// or use String.fromCharCode(event.keyCode) to compare chars

		// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
		switch (event.keyCode)
		{
			case (37):	// LEFT key
				console.log("Tecla LEFT pressionada");
				
			case (38):	// UP key
				console.log("Tecla UP pressionada");
				
			case (39):	// RIGHT key
				console.log("Tecla RIGHT pressionada");
				
			case (40):	// DOWN key
				console.log("Tecla DOWN pressionada");
				
		};
	};*/
	
	/**
	 * initKeys
	 */
	initKeys() {
		this.scene.gui=this;
		this.processKeyboard=function(){};
		this.activeKeys={};
	}
	
	/**
	 * processKeyDown
	 * @param event {Event}
	 */
	processKeyDown(event) {
		this.activeKeys[event.code]=true;
	};
	
	/**
	 * processKeyUp
	 * @param event {Event}
	 */
	processKeyUp(event) {
		this.activeKeys[event.code]=false;
	};
	
	/**
	 * isKeyPressed
	 * @param event {Event}
	 */
	isKeyPressed(keyCode) {
		return this.activeKeys[keyCode] || false;
	}

