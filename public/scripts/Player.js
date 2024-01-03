import Ray from "./Ray.js";
import Keyboard   from "./utils/Keyboard.js";
import { DirectionVector, Vector } from "./utils/utils.js";
import { PI, abs, cos, sin, floor, degToRads } from "./utils/maths.js";
import Mouse from "./utils/Mouse.js";

export default class Player{
    #fov = 60;
    #rays = [];
    #angle = 0x0;
    #color = "#fff";
    #rayColor = "blue";
    #angleSpeed = 1;
    #velocity = 0x1;

    constructor(board, ctx, x, y, r){
        this.r = r;
        this.ctx = ctx;
        this.board = board;
        this.pos = new Vector(x, y);
        this.vel = new Vector(this.#velocity, this.#velocity);
        this.dir = new DirectionVector(this.angle);
        this.mouse = new Mouse(this.canvas);
        this.keyboard = new Keyboard();
        this.currentSector = new Vector();
    }

    get canvas()
    {
        return this.ctx.canvas;
    }

    get x()
    {
        return this.pos.x;
    }

    get y()
    {
        return this.pos.y;
    }

    set x(x = 0)
    {
        this.pos.x = x;
    }

    set y(y = 0)
    {
        this.pos.y = y;
    }

    get halfWidth()
    {
        return this.canvas.width / 2;
    }

    get halfHeight()
    {
        return this.canvas.height / 2;
    }

    get color()
    {
        return this.#color;
    }

    set color(color = "#fff")
    {
        this.#color = color;
    }

    get rayColor()
    {
        return this.#rayColor;
    }

    set rayColor(color = "blue")
    {
        this.#rayColor = color;
    }

    get fov()
    {
        return this.#fov;
    }

    set fov(fov = 90)
    {
        this.#fov = fov;
    }

    get rays()
    {
        return this.#rays;
    }

    set rays(rays = [])
    {
        this.#rays = rays;
    }

    get angle()
    {
        return this.#angle;
    }

    set angle(angle = 0x0)
    {
        this.#angle = angle;
        this.dir.angle = angle;
    }

    get angleSpeed()
    {
        return this.#angleSpeed;
    }

    set angleSpeed(angleSpeed = 1)
    {
        this.#angleSpeed = angleSpeed;
    }

    get kkeys()
    {
        return this.keyboard.keys;
    }

    setup(playerVel, playerRadius, rayColor = "#fff"){
        this.keyboard.setup();
        this.mouse.setup();

        this.r = playerRadius;
        this.vel = playerVel || this.vel;
        this.rayColor = rayColor;
    }

    draw()
    {
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    normalizeAngle(angle)
    {
        return angle >= 0 ? angle % 0x168 : 0x168 + angle;
    }

    move()
    {
        let pressedAorD = this.kkeys.get(0x41) || this.kkeys.get(0x44);
        let aod = pressedAorD ? this.kkeys.get(0x41) ? 0x41 : 0x44 : false;

        //W or S
        if(this.kkeys.get(0x57) || this.kkeys.get(0x53)){
            let sense = this.kkeys.get(0x57) ? 1 : -1;
                sense = this.dir.lookingLEFT ? -sense : sense;

            let senseY = this.kkeys.get(0x57) ? 1 : -1;
                senseY = this.dir.lookingTOP ? -senseY : senseY;

            //console.log(this.dir.lookingLEFT);
            
            const playerSize = (this.board.wmap / 2) * sense | 0;
            const playerSizeY = (this.board.wmap / 2) * senseY | 0;

            this.vel.x = abs(this.vel.x);
            this.vel.y = abs(this.vel.y);

            if(this.kkeys.get(0x53))
            {
                this.vel.x *= -1;
                this.vel.y *= -1;
            }
            
            const nx = (this.x) + this.vel.x * cos(degToRads(this.angle));
            const ny = (this.y) + this.vel.y * -sin(degToRads(this.angle));

            if(!this.checkCollision(nx + playerSize, this.y))
            {
                this.x = nx;
            }

            if(!this.checkCollision(this.x, ny + playerSizeY))
            {
                this.y = ny;
            }
        }

        //A or D
        if(pressedAorD){
            const sense = this.kkeys.get(0x41) ? 1 : -1;
            const angle = this.angle + (90 * sense);

            this.vel.x = abs(this.vel.x);
            this.vel.y = abs(this.vel.y);
            
            const nx = (this.x) + (this.vel.x * 0.5) * cos(degToRads(angle));
            const ny = (this.y) + (this.vel.y * 0.5) * -sin(degToRads(angle));

            const playerSX = (this.board.wmap / 2) * Math.sign(cos(degToRads(angle))) | 0;
            const playerSY = (this.board.wmap / 2) * Math.sign(-sin(degToRads(angle))) | 0;

            if(!this.checkCollision(nx + playerSX, this.y))
            {
                this.x = nx;
            }

            if(!this.checkCollision(this.x, ny + playerSY))
            {
                this.y = ny;
            }
        }

        if(this.mouse.isMoving)
        {
            this.angleSpeed = this.mouse.rotationSpeed;
            this.angle += this.angleSpeed;
        }

        this.dir.angle = this.normalizeAngle(this.angle);
        this.updateRays(aod);
    }

    drawSight(x, y, r = 20, lineSize = 2, color = "red")
    {
        const hr = r / 2;

        this.ctx.save();
        this.ctx.lineWidth = lineSize;
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;

        
        //TOP LEFT SIDE OF SIGHT
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, degToRads(200), degToRads(250));
        this.ctx.stroke();
        this.ctx.closePath();

        //TOP RIGHT SIDE OF SIGHT
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, degToRads(290), degToRads(340));
        this.ctx.stroke();
        this.ctx.closePath();

        //BOTTOM LEFT SIDE OF SIGHT
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, degToRads(110), degToRads(160));
        this.ctx.stroke();
        this.ctx.closePath();

        //BOTTOM RIGHT SIDE OF SIGHT
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, degToRads(20), degToRads(70));
        this.ctx.stroke();
        this.ctx.closePath();

        //DOT
        this.ctx.beginPath();
        this.ctx.arc(x, y, r / 10, 0, degToRads(360));
        this.ctx.fill();
        this.ctx.closePath();

        //LEFT LINE OF SIGHT
        this.ctx.beginPath();
        this.ctx.moveTo(x - r - (r / 8), y);
        this.ctx.lineTo(x - (r / 2), y);
        this.ctx.stroke();
        this.ctx.closePath();

        //RIGHT LINE OF SIGHT
        this.ctx.beginPath();
        this.ctx.moveTo(x + r + (r / 8), y);
        this.ctx.lineTo(x + (r / 2), y);
        this.ctx.stroke();
        this.ctx.closePath();

        //TOP LINE OF SIGHT
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - r - (r / 8));
        this.ctx.lineTo(x, y - (r / 2));
        this.ctx.stroke();
        this.ctx.closePath();

        //BOTTOM LINE OF SIGHT
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + r + (r / 8));
        this.ctx.lineTo(x, y + (r / 2));
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.restore();
    }

    /**Check collision with the map*/
    checkCollision(nx, ny)
    {
        const map  = this.board.vmap;
        const wmap = this.board.wmap;
        const hmap = this.board.hmap;

        const x = floor(nx / wmap);
        const y = floor(ny / hmap);

        return map[y][x] != "_";
    }

    updateRays(key){


        this.rays.forEach(ray =>{
            /*if(key)
            {
                if(key === 0x41)
                {
                    ray.angle = this.normalizeAngle(ray.angle + this.angleSpeed);
                }
                else
                {
                    ray.angle = this.normalizeAngle(ray.angle - this.angleSpeed);
                }

                ray.direction.angle = ray.angle;
            }*/

            if(this.mouse.isMoving)
            {
                ray.angle = this.normalizeAngle(ray.angle + this.angleSpeed);
                ray.direction.angle = ray.angle;
            }

            ray.p1.x = this.x;
            ray.p1.y = this.y;
        });
    }

    setupRays(cwidth, cheight){
        const numberOfRays = this.board.scene.width / 2;
        const range = (numberOfRays / 2) | 0;

        const step = (this.fov / numberOfRays);

        for(let i = -range; i < range; i++){
            this.rays.push(
                new Ray(
                    this.normalizeAngle(-i * step),
                    this.x, 
                    this.y,
                    cwidth,
                    cheight
                )
            );
        }
    }

    updateCurrentSector(woffset, hoffset){
        this.currentSector.x = floor(this.x / woffset);
        this.currentSector.y = floor(this.y / hoffset);
    }

    proyect()
    {
        this.ctx.save();
        this.ctx.strokeStyle = this.rayColor;

        this.rays.forEach(ray => {
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);

            this.ctx.lineTo(
                /*ray.p1.x + cos(degToRads(ray.angle)) * ray.p2.x, 
                ray.p1.y - sin(degToRads(ray.angle)) * ray.p2.y*/
                ray.p2.x,
                ray.p2.y
            );

            this.ctx.stroke();
        });

        this.ctx.restore();
    }

    drawCameraAngle(){
        this.ctx.save();
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "50px serif";
        this.ctx.fillText(this.angle, 50, 75);
        this.ctx.restore();
    }

}