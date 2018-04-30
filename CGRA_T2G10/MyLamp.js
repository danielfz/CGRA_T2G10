/**
 * MyLamp
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyLamp extends CGFobject
{
	constructor(scene,slices,stacks,minS,maxS,minT,maxT) 
	{
		super(scene);

        this.minS = (typeof minS == 'undefined') ? 0.0 : minS;
        this.maxS = (typeof maxS == 'undefined') ? 1.0 : maxS;
        this.minT = (typeof minT == 'undefined') ? 0.0 : minT;
        this.maxT = (typeof maxT == 'undefined') ? 1.0 : maxT;
        this.dS = this.maxS - this.minS;
        this.dT = this.maxT - this.minT;

        console.log("minS: " + this.minS);
        console.log("maxS: " + this.maxS);
        console.log("dS: " + this.dS);
        console.log("minT: " + this.minT);
        console.log("maxT: " + this.maxT);
        console.log("dT: " + this.dT);

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

        console.log("---");
        let z = 0;
        let dz = 1.0/this.stacks;
        for (let i = 0; i < (this.stacks+1)-1; ++i) { // 1 stack = 2 filas de pontos
            this.addCircleVerticesAndNormals(z);
            z += dz;
        }
        console.log("---");
        
        for (let i = 0; i < this.stacks-1; ++i) { // 2 stacks = 1 stack no meio + topo
            this.addStackIndices(i);
        }

        /*
         * Top
         */
        for (let i = 0; i < this.slices; ++i) { // 4 slices = 4 pontos no topo
            this.vertices.push(0.0, 0.0, this.R);
            this.normals.push(0.0, 0.0, 1.0);
            let s = this.minS + ((i+0.5)/this.slices)*this.dS;
            console.log("# " + s);
            this.texCoords.push(s, this.minT);
        }
        this.addLastStackIndices();

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

    addCircleVerticesAndNormals(Z) {
        let dtheta = 2.0*Math.PI/this.slices;
        let theta = 0.0;

        let R_base = Math.sqrt(this.R*this.R - Z*Z);
        let tCoord = this.minT + this.dT*(Math.PI/2.0 - Math.asin(Z/this.R))/(Math.PI/2.0);
        //console.log("-> " + tCoord);
        for (let i = 0; i < this.slices+1; ++i) {
            let cos = Math.cos(theta);
            let sin = Math.sin(theta);

            this.vertices.push(R_base*cos, R_base*sin, Z);
            let s = this.minS + this.dS*(i/this.slices);
            this.texCoords.push(s, tCoord);
            console.log("% " + s);

            let normal_Z = Math.sqrt(1-R_base*R_base*(cos*cos+sin*sin));
            this.normals.push(cos,sin,normal_Z);

            theta += dtheta;
        }
    };

    addStackIndices(stack) {
        let CIRCLE1 = stack*(this.slices+1);
        let CIRCLE2 = CIRCLE1 + this.slices+1;
        //let lastCircleVertex = this.slices;
        for (let i = 0; i < this.slices+1; ++i) {
            this.indices.push(CIRCLE1+i,   CIRCLE1+i+1, CIRCLE2+i);
            this.indices.push(CIRCLE1+i+1, CIRCLE2+i+1, CIRCLE2+i);
        }
        //this.indices.push(CIRCLE1, CIRCLE2,                  CIRCLE1+lastCircleVertex);
        //this.indices.push(CIRCLE2, CIRCLE2+lastCircleVertex, CIRCLE1+lastCircleVertex);
    };

    addLastStackIndices() {
        /* Ex: 2 stacks; 4 slices
         * START = 1 * 5
         * TOP_START = 
         */
        let POINTS_PER_STACK = this.slices + 1;
        let START = (this.stacks-1)*POINTS_PER_STACK;
        //let TOP_START = this.stacks*this.slices;
        let TOP_START = START + (this.slices+1);
        for (let i = 0; i < this.slices; ++i) {
            this.indices.push(START+i,   START+i+1, TOP_START+i);
        }
        //this.indices.push(START+this.slices-1,   START, TOP_START);
    }
};




