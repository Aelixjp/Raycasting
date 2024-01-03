import { sqrt } from "./maths.js";

export class Vector
{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    static distance(x1, y1, x2, y2)
    {
        return sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2));
    }

    static intersection(vect1, vect2, vect3, vect4)
    {
        const { x1, y1 } = { x1: vect1.x, y1: vect1.y };
        const { x2, y2 } = { x2: vect2.x, y2: vect2.y };
        const { x3, y3 } = { x3: vect3.x, y3: vect3.y };
        const { x4, y4 } = { x4: vect4.x, y4: vect4.y };

        const d = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
    
        if(d === 0)
            return false;
        else
        {
            const t = (((x1 - x3) * (y3 - y4)) - ((y1 - y3) * (x3 - x4))) / d;
            const u = (((x1 - x3) * (y1 - y2)) - ((y1 - y3) * (x1 - x2))) / d;

            //console.log(t, u);

            if(t >= 0 && t <= 1 && u >= 0 && u <= 1)
            {
                const n1 = ((x1 * y2) - (y1 * x2));

                return new Vector(
                    ((n1 * (x3 - x4)) - ((x1 - x2) * ((x3 * y4) - (y3 * x4)))) / d,
                    ((n1 * (y3 - y4)) - ((y1 - y2) * ((x3 * y4) - (y3 * x4)))) / d
                );
            }

            return false;
        }
    }
}

export class Dimension
{
    constructor(width = 0, height = 0)
    {
        this.width = width;
        this.height = height;
    }
}

export class DirectionVector
{
    constructor(angle)
    {
        this.angle = angle;
    }

    get lookingTOP(){
        return this.angle >= 0 && this.angle <= 180;
    }

    get lookingBOTTOM(){
        return this.angle > 180 && this.angle < 360;
    }

    get lookingLEFT(){
        return this.angle > 90 && this.angle < 270;
    }

    get lookingRIGHT(){
        return this.angle <= 90 || this.angle >= 270;
    }
}