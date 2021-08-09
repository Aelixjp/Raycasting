export const degToRads = deg => (Math.PI / 180) * deg;

export class Vector{

    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

}

export class Dimension{

    constructor(width = 0, height = 0){
        this.width = width;
        this.height = height;
    }

}