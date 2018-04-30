/**
 * MyCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder extends CGFobject
{
	constructor(scene,slices,stacks) 
	{
		super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.R = 1.0;
		this.initBuffers();
	};

	initBuffers() 
	{
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

        let z = 0;
        let dz = 1.0/this.stacks;
        for (let i = 0; i < this.stacks+1; ++i) {
            this.addCircleVerticesAndNormals(z);
            z += dz;
        }
        
        for (let i = 0; i < this.stacks; ++i) {
            this.addStackIndices(i);
        }

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

    addCircleVerticesAndNormals(Z) {
        let dtheta = 2.0*Math.PI/this.slices;
        let theta = 0.0;

        for (let i = 0; i < this.slices+1; ++i) {
            let cos = Math.cos(theta);
            let sin = Math.sin(theta);
            this.vertices.push(this.R*cos,this.R*sin,Z);
            this.normals.push(cos,sin,0.0);
            this.texCoords.push(Z,(i/this.slices));
            theta += dtheta;
        }
    };

    addStackIndices(stack) {
        let CIRCLE1 = stack*(this.slices+1);
        let CIRCLE2 = CIRCLE1 + this.slices+1;
        let lastCircleVertex = this.slices;
        for (let i = 0; i < lastCircleVertex; ++i) {
            this.indices.push(CIRCLE1+i,   CIRCLE1+i+1, CIRCLE2+i);
            this.indices.push(CIRCLE1+i+1, CIRCLE2+i+1, CIRCLE2+i);
        }
        //this.indices.push(CIRCLE1, CIRCLE2,                  CIRCLE1+lastCircleVertex);
        //this.indices.push(CIRCLE2, CIRCLE2+lastCircleVertex, CIRCLE1+lastCircleVertex);
    };
};




