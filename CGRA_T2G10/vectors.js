/*
 * Basic linear algebra functions.
 */

function addVector(s, t) { return [s[0]+t[0], s[1]+t[1], s[2]+t[2]]; }

function subVector(s, t) { return [s[0]-t[0], s[1]-t[1], s[2]-t[2]]; }

function intProduct(s, t) { return s[0]*t[0] + s[1]*t[1] + s[2]*t[2]; }

function multVector(v,k) { return [v[0]*k, v[1]*k, v[2]*k]; }

function modVector(v) { return Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]); }

function crossProd(s, t) { return [s[1]*t[2]-s[2]*t[1], s[2]*t[0]-s[0]*t[2], s[0]*t[1]-s[1]*t[0]]; }

function rotVectorInY(v,alpha) { 
    let c = Math.cos(alpha);
    let s = Math.sin(alpha);
    return [v[0]*c + v[2]*s, v[1], v[2]*c - v[0]*s];
}

function log (msg) {
    if (DEBUG_MSGS) {
        console.log(msg);
    }
}
