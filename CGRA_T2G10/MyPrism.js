/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyPrism extends CGFobject
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

        this.computeSideFaces();
        this.computeBaseFaces();

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

    computeSideFaces() {
        let dtheta = 2.0*Math.PI/this.slices;
        let dz = 1.0/this.stacks;
        let z = 0.0;
        let n = 0;
        console.log("num stacks: " + this.stacks);
        for (let j = 0; j < this.stacks; ++j) {
            let theta = 0.0;
            for (let i = 0; i < this.slices; ++i) {
                let rcos          = this.R*Math.cos(theta);
                let rsin          = this.R*Math.sin(theta);
                let rcos_plus_dth = this.R*Math.cos(theta+dtheta);
                let rsin_plus_dth = this.R*Math.sin(theta+dtheta);

                this.vertices.push(rcos,          rsin,          z);
                this.vertices.push(rcos_plus_dth, rsin_plus_dth, z);
                this.vertices.push(rcos,          rsin,          z+dz);
                this.vertices.push(rcos_plus_dth, rsin_plus_dth, z+dz);

                //console.log(this.vertices[n] + ", " + this.vertices[n+1] + ", " + this.vertices[n+2]);

                this.indices.push(n,n+1,n+3);
                this.indices.push(n,n+3,n+2);

                let htheta = theta+(dtheta/2);
                let cos = Math.cos(htheta);
                let sin = Math.sin(htheta);
                this.normals.push(cos,sin,0.0);
                this.normals.push(cos,sin,0.0);
                this.normals.push(cos,sin,0.0);
                this.normals.push(cos,sin,0.0);

                theta += dtheta;
                n += 4;
            }
            z += dz;
        }
    }

    computeBaseFaces() {
        let n_side = this.vertices.length/3;

        let theta = 0.0;
        let dtheta = 2.0*Math.PI/this.slices;
        for (let j = 0; j < this.slices; ++j) {
            let rcos          = this.R*Math.cos(theta);
            let rsin          = this.R*Math.sin(theta);
            this.vertices.push(rcos, rsin, 0);
            this.vertices.push(rcos, rsin, 1);
            this.normals.push(0, 0, -1.0);
            this.normals.push(0, 0, +1.0);
            theta += dtheta;
        }


        let n_mid = this.vertices.length/3;
        this.vertices.push(0.0, 0.0, 0.0);
        this.vertices.push(0.0, 0.0, 1.0);
        this.normals.push(0.0, 0.0, -1.0);
        this.normals.push(0.0, 0.0, +1.0);

        for (let i = 0; i < this.slices; ++i) {
            this.indices.push(n_side+i*2+2,n_side+i*2,n_mid);
        }
        this.indices.push(n_side,n_side+(this.slices-1)*2,n_mid);

        for (let i = 0; i < this.slices; ++i) {
            this.indices.push((n_side+1)+i*2,(n_side+1)+i*2+2,n_mid+1);
        }
        this.indices.push((n_side+1)+(this.slices-1)*2,(n_side+1),n_mid+1);
    }
};
