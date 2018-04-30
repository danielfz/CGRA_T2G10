
/**
 * MyCircle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCircle extends CGFobject
{
	constructor(scene,slices) 
	{
		super(scene);
        this.slices = slices;
        this.R = 1.0;
		this.initBuffers();
	};

	initBuffers() 
	{
		this.vertices = [];
		this.indices = [];
		this.normals = [];
        this.texCoords = [];

        let z = 1.0;

        // Center
        this.vertices.push(0.0, 0.0, z);
        this.normals.push(0.0, 0.0, 1.0);
        this.texCoords.push(0.5,0.5);

        this.addCircleVertices(z);
        this.addCircleIndices(0);

        for (let i = 0; i < this.slices; ++i) {
            this.normals.push(0.0, 0.0, 1.0);
        }

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

    addCircleVertices(Z) {
        let tX0 = 0.5;
        let tY0 = 0.5;
        let tR = 0.5;

        let dtheta = 2.0*Math.PI/this.slices;
        let theta = 0.0;
        for (let i = 0; i < this.slices; ++i) {
            let cos = Math.cos(theta);
            let sin = Math.sin(theta);
            this.vertices.push(this.R*cos,this.R*sin,Z);
            this.texCoords.push(tX0+tR*cos,tY0-tR*sin);
            theta += dtheta;
        }
    };

    addCircleIndices(CENTER) {
        let FIRST = CENTER+1;
        for (let i = 0; i < this.slices-1; ++i) {
            this.indices.push(FIRST+i, FIRST+i+1, CENTER);
        }
        this.indices.push(FIRST,CENTER,FIRST+this.slices-1);
    }
};




