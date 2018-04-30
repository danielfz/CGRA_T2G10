/**
 * MyGlobe
 * @constructor
 */
 class MyGlobe extends CGFobject
 {
	constructor(scene,slices,stacks) 
	{
		super(scene);

        this.slices = slices ? slices : 12;
        this.stacks = stacks ? stacks : 16;
		this.north = new MyLamp(this.scene,this.slices,this.stacks,
            0.0, 1.0, 0.0, 0.5);
		this.south = new MyLamp(this.scene,this.slices,this.stacks,
            1.0, 0.0, 1.0, 0.5);
        this.appearance = new CGFappearance(this.scene);
        this.appearance.loadTexture("../resources/images/world_map.jpg");
		this.appearance.setAmbient(1.0,1.0,1.0,1);

	};

	display() 
	{
        this.appearance.apply();

        this.north.display();

        this.scene.pushMatrix();
          //this.scene.rotate(Math.PI, 0.0, 0.0, 1.0);
          this.scene.rotate(Math.PI, 1.0, 0.0, 0.0);
          this.south.display();
        this.scene.popMatrix();
	};
 };

