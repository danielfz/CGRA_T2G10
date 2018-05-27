/**
 * MyBlock
 * @constructor
 */

class MyTrap extends CGFobject
{
	constructor(scene,p0,p1,p2,p3,minS,maxS,minT,maxT) 
	{
		super(scene);

        this.minS = minS || 0.0;
        this.maxS = maxS || 1.0;
        this.minT = minT || 0.0;
        this.maxT = maxT || 1.0;
		this.initBuffers(p0,p1,p2,p3);
	};


	initBuffers(p0,p1,p2,p3) 
	{

        /*
         * 1         0
         * *---------*
         *  \     4   \
         *   \   *     \
          *   \         \
         *     *---------*
         *    2         3
         *
         */

         let points = [
            p0[0], p0[1], p0[2],
            p1[0], p1[1], p1[2],
            p2[0], p2[1], p2[2],
            p3[0], p3[1], p3[2]
        ];

        // centroid
        for (let i = 0; i < 3; ++i) {
            let sum = 0.0;
            for (let j = 0; j < 4; ++j) {
                sum += points[3*j+i];
            }
            points.push(sum/4.0);
        }

        let dists = [];
        for (let j = 0; j < 4; ++j) {
            for (let i = 0; i < 3; ++i) {
                dists.push(points[3*4+i] - points[3*j+i]);
            }
        }

        /*
        for (let j = 0; j < 4; ++j) {
            console.log(points[3*j+0] + ", " + points[3*j+1] + ", " + points[3*j+2]);
        }

        let angles = [];
        angles.push(0.0);
        let n1 = [dists[0], dists[1], dists[2]];
        let n1_norm = modVector(n1);
        for (let j = 1; j < 4; ++j) {
            let d = [dists[3*j], dists[3*j+1], dists[3*j+1]];
            let d_norm = modVector(d);

            let cos = intProduct(d,n1) / (n1_norm*d_norm);
            console.log(points[3*j+0] + ", " + points[3*j+1] + ", " + points[3*j+2]);
        }
        */

        this.vertices = points;

        let normal = crossProd([dists[0], dists[1], dists[2]],[dists[3], dists[4], dists[5]]);
        let normal_len = modVector(normal);
        this.normals = [];
        for (let i = 0; i < 5; ++i) {
            this.normals.push(normal[0],normal[1],normal[2]);
            //console.log([normal[0]/normal_len, normal[1]/normal_len, normal[2]/normal_len]);
        }

        this.indices = [
            1, 4, 0,
            2, 4, 1,
            3, 4, 2,
            0, 4, 3
        ];


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
