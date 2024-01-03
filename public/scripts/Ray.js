import { Vector, DirectionVector } from "./utils/utils.js";

export default class Ray{

    constructor(angle = 0, x1 = 0, y1 = 0, x2 = 1000, y2 = 1000){
        this.p1 = new Vector(x1, y1);
        this.p2 = new Vector(x2, y2);
        
        this.angle = angle;
        this.directionVector = new DirectionVector(this.angle);
    }

    get distance(){
        return Vector.distance(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }

    get direction()
    {
        return this.directionVector;
    }

}