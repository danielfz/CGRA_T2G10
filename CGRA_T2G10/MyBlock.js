
/**
 * MyBlock
 * @constructor
 */
class MyBlock extends CGFobject
{
	constructor(scene,p0,p1,p2,p3,p4,p5,p6,p7,minS,maxS,minT,maxT) 
	{
		super(scene);

        this.minS = minS || 0.0;
        this.maxS = maxS || 1.0;
        this.minT = minT || 0.0;
        this.maxT = maxT || 1.0;
		this.initBuffers(p0,p1,p2,p3,p4,p5,p6,p7);
	};


	initBuffers(p0,p1,p2,p3,p4,p5,p6,p7) 
	{
		this.indices = [];
        this.normals = [];

        /*
         *      0---1
         *     /|  /|
         *    2---3 |
         *    | | | |
         *    | 4-|-5
         *    |/  |/
         *    6---7   
         */
        this.vertices = [];

        //this.addTriangle(p0,p2,p1, [ 0,1,0]);

        /*
        let toAdd = [];
        toAdd.push(p0,p1,p2,p3,p4,p5,p6,p7);
        for (let i = 0; i < toAdd.length; ++i) {
            for (let j = 0; j < 3; ++j) {
                for (let k = 0; k < 3; ++k) {
                    this.vertices.push(toAdd[i][k]);
                }
            }
        }


        this.addTriangle(0,2,1, [ 0,1,0]);
        this.addTriangle(2,3,1, [ 0,1,0]);

        this.addTriangle(2,0,4, [-1,0,0]);
        this.addTriangle(6,2,4, [-1,0,0]);

        this.addTriangle(5,1,3, [1,0,0]);
        this.addTriangle(3,7,5, [1,0,0]);

        this.addTriangle(2,6,3, [0,0,1]);
        this.addTriangle(6,7,3, [0,0,1]);

        this.addTriangle(0,1,4, [0,0,-1]);
        this.addTriangle(1,5,4, [0,0,-1]);

        this.addTriangle(6,4,5, [0,-1,0]);
        this.addTriangle(6,5,7, [0,-1,0]);
        */

        /*
        this.texCoords = [
            this.minS, this.maxT,
            this.maxS, this.maxT,
            this.minS, this.minT,
            this.maxS, this.minT,
        ];
        */

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};
